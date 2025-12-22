# Feature 03 — Project Profile: Details + Zoning Map Placeholder (Mapbox + Dummy Zoning)

## Objective
Implement a “Project Home/Profile” page where developers can store the core site + planning + proposal metadata for a project, then manually click **Update** to persist all changes. Page includes a **Mapbox zoning-style map placeholder** (dummy zoning polygons + legend) centered on the project location (geocoded from address when possible). Include a “Project setup complete” state.

---

## Dependencies (must already exist)
- Feature 01 App Shell + Layout (sidebar/topbar/content + routing)
- Feature 02 Projects List + CRUD (projects exist and can be clicked)
- Next.js App Router + TypeScript
- Supabase configured (env vars + client)
- shadcn/ui (or equivalent) for inputs, dialogs, toast, buttons
- Mapbox token available

### Required env vars
- `NEXT_PUBLIC_MAPBOX_TOKEN` (client map rendering)
- `MAPBOX_TOKEN` (server-side geocoding; can reuse same value but keep server var separate)

---

## Part A — Data Model (Supabase)

### A1) Add `project_profiles` table (1:1 with projects)
Use a separate profile table to avoid bloating `projects` with dozens of columns. Store structured fields in `data` (jsonb) with a stable schema (below).

**SQL migration**
```sql
create table if not exists public.project_profiles (
  project_id uuid primary key references public.projects(id) on delete cascade,
  updated_at timestamptz not null default now(),
  setup_status text not null default 'draft' check (setup_status in ('draft','complete')),
  data jsonb not null default '{}'::jsonb
);

create index if not exists project_profiles_updated_at_idx on public.project_profiles(updated_at desc);
A2) RLS policies (mirror whatever “projects ownership” rule is)
Assume projects has an owner_id uuid that equals auth.uid().

Enable RLS

sql
Copy code
alter table public.project_profiles enable row level security;
Policies

sql
Copy code
create policy "read own project_profiles"
on public.project_profiles
for select
using (
  exists (
    select 1
    from public.projects p
    where p.id = project_profiles.project_id
      and p.owner_id = auth.uid()
  )
);

create policy "upsert own project_profiles"
on public.project_profiles
for insert
with check (
  exists (
    select 1
    from public.projects p
    where p.id = project_profiles.project_id
      and p.owner_id = auth.uid()
  )
);

create policy "update own project_profiles"
on public.project_profiles
for update
using (
  exists (
    select 1
    from public.projects p
    where p.id = project_profiles.project_id
      and p.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.projects p
    where p.id = project_profiles.project_id
      and p.owner_id = auth.uid()
  )
);
A3) Canonical Profile JSON schema (store in project_profiles.data)
Store this shape (TypeScript type below). Keep it stable because later features (Data Sources, Pro Forma, AI) will read from it.

TypeScript type (authoritative)
ts
Copy code
export type ProjectProfileData = {
  // --- Overview (required-ish)
  overview: {
    projectDisplayName: string;      // editable; can differ from Projects list name if you want
    siteAddress: string;             // full single-line address
    city: string;                    // default "Coquitlam"
    province: string;                // default "BC"
    postalCode?: string;
    notes?: string;
  };

  // --- Location for map
  location: {
    lat?: number;
    lng?: number;
    geocodeConfidence?: "high" | "medium" | "low" | "manual" | "unknown";
    geocodeProvider?: "mapbox";
    lastGeocodedAt?: string;         // ISO
  };

  // --- Site & Legal
  siteLegal: {
    pid?: string;                    // Parcel Identifier
    legalDescription?: string;
    titleNotes?: string;             // “charges on title / SRWs / covenants” summarized
    lotArea?: { value: number; unit: "m2" | "sqft" };
    lotDimensions?: { widthM?: number; depthM?: number; frontageM?: number };
  };

  // --- Planning Context (what developers always track)
  planning: {
    currentZoning?: string;          // e.g., "RT-1", "RM-3" etc (free text)
    ocpDesignation?: string;         // free text
    developmentPermitAreas?: {
      formAndCharacter?: boolean;
      watercourseProtection?: boolean;
      hazardousConditions?: boolean; // steep slopes, etc
    };
    constraintsFlags?: {
      nearWatercourse?: boolean;
      steepSlope?: boolean;
      heritage?: boolean;
      contaminatedSite?: boolean;
      significantTrees?: boolean;
    };
    variancesRequested?: string;     // multiline summary
  };

  // --- Proposal Summary (MVP inputs that feed feasibility/pro forma later)
  proposal: {
    applicationType?: "Rezoning" | "Development Permit" | "Subdivision" | "Building Permit" | "OCP Amendment" | "Other";
    primaryUse?: "Multi-family" | "Single-family" | "Townhouse" | "Mixed-use" | "Commercial" | "Industrial" | "Other";
    unitsProposed?: number;
    gfa?: { value: number; unit: "m2" | "sqft" };
    storeys?: number;
    heightM?: number;
    siteCoveragePct?: number;
    fsr?: number;                   // optional computed on client when lotArea + gfa exist
    parking?: {
      required?: number;
      provided?: number;
      notes?: string;
    };
  };

  // --- Document readiness (NO uploads in this feature; status only)
  docsChecklist?: Array<{
    key:
      | "title_search"
      | "site_plan"
      | "context_plan"
      | "project_statistics"
      | "floor_plans_parking"
      | "setback_diagram"
      | "elevations"
      | "renderings"
      | "topo_survey"
      | "landscape_plan"
      | "servicing_concept"
      | "stormwater_plan"
      | "arborist_report"
      | "environmental_assessment"
      | "geotechnical_report";
    label: string;
    status: "not_started" | "in_progress" | "ready";
    notes?: string;
    updatedAt?: string; // ISO
  }>;
};
A4) Default checklist seed (create on first profile create)
When a project has no profile yet, create one with:

overview.city="Coquitlam", overview.province="BC"

docsChecklist pre-populated with the keys above and friendly labels

setup_status="draft"

Part B — Backend / Data Access
B1) Data fetching contract
On the Project Profile page load:

Fetch projects row for [projectId] (for breadcrumb + basic identity).

Fetch project_profiles row.

If profile missing, create default profile (server action or on-demand insert) then return it.

B2) Server actions (recommended)
Create server actions in e.g.:

app/projects/[projectId]/actions.ts

Actions:

getProjectAndProfile(projectId)

returns { project, profile }

ensures profile exists (insert default if missing)

updateProjectAndProfile(projectId, payload)

payload includes:

updated project name (if you want the list name synced)

profileData (full JSON)

if address changed and location.lat/lng missing OR user clicked “Re-geocode”, run Mapbox geocode server-side and update location.

B3) Manual Save semantics (single Update button)
All form edits are local state until Update clicked.

On Update:

validate minimal required fields (see Part C5)

compute derived values (fsr)

optionally geocode

upsert project_profiles with data

compute setup_status (“complete” if required fields present)

show toast success/failure

Part C — UI / UX Implementation (Developer-grade)
C1) Route + page file
app/projects/[projectId]/page.tsx (server component that loads project+profile)

Render a client component <ProjectProfileClient initialProject initialProfile /> for form state + map.

C2) Layout (Drive-like, dev-friendly)
Page structure:

Top row: breadcrumb Projects / {projectName}, right-side actions:

Update (primary) disabled unless dirty

Cancel (secondary) resets to last-saved

Body: responsive 2-column

Left: form sections (stacked cards/accordion)

Right: Map card (sticky on desktop if desired)

Mobile: Map below Overview section or collapsible.

C3) Form sections (use Cards + Accordion)
Implement these sections (all fields map to ProjectProfileData):

Overview

Project Display Name (text)

Site Address (text, full address)

City (text, default Coquitlam)

Province (text, default BC)

Postal Code (text, optional)

Notes (textarea)

Site & Legal

PID (text)

Legal Description (textarea)

Lot Area (number + unit select m2/sqft)

Lot Dimensions (widthM, depthM, frontageM) numbers

Title Notes / Encumbrances Summary (textarea)

Planning Context

Current Zoning (text)

OCP Designation (text)

Development Permit Areas (checkboxes):

Form & Character

Watercourse Protection

Hazardous Conditions

Constraints Flags (checkboxes):

Near watercourse

Steep slope

Heritage

Contaminated site

Significant trees

Variances Requested (textarea)

Proposal Summary

Application Type (select)

Primary Use (select)

Units Proposed (number)

GFA (number + unit select)

Storeys (number)

Height (m) (number)

Site Coverage (%) (number 0–100)

Parking Required / Provided (numbers)

FSR (read-only; computed when lot area + GFA are present)

Document Checklist (status-only)

Render checklist rows (label + status pill select + notes)

No uploads/links in this feature; only status/notes.

Provide “Mark all not started” (optional) and per-row update timestamp.

C4) State management + validation
Use react-hook-form + zod for schema validation (client-side).

Maintain a dirty flag (compare current form values to initial).

Disable Update when:

not dirty OR update in progress

On Cancel: reset form to initialProfile and reset dirty state.

Toast on save success/failure.

C5) “Project setup complete” definition + UI
Compute setup_status as:

complete when ALL are true:

overview.projectDisplayName non-empty

overview.siteAddress non-empty

planning.currentZoning non-empty

siteLegal.lotArea.value exists and > 0

proposal.applicationType exists

proposal.primaryUse exists

Otherwise draft

UI:

If complete: show a compact success banner at top of form: “Project setup complete”

If draft: show a subtle info banner: “Complete setup to unlock modeling + AI context later” (no links)

Persist setup_status in DB on Update.

Part D — Zoning Map Placeholder (Mapbox)
D1) Map component contract
Create:

components/maps/ZoningPlaceholderMap.tsx (client component)

Inputs:

center: {lat,lng} (project coordinates OR fallback)

pin: {lat,lng} optional

dummyZonesGeojson: FeatureCollection (generated around center)

legend: derived from geojson zone categories

D2) Fallback center
If no project coordinates:

default center to Coquitlam (approx):

lat=49.283764, lng=-122.793205

show helper text inside map card: “Add an address and click Update to geocode.”

D3) Dummy zoning overlay generation (must feel real)
Implement a small deterministic generator that creates polygons around the center so it looks like a zoning layer:

Create 6–12 polygons (rectangles or simple shapes) within ~1–2km bounds.

Assign zone categories (strings) like:

RS (Residential Small)

RM (Residential Multi)

C (Commercial)

M (Industrial)

P (Parks/Open Space)

Store these as properties.zoneCode and properties.zoneLabel.

Rendering:

Base style: Mapbox Light.

Add a fill layer for zones with category-based color.

Add a thin outline layer for zone boundaries.

Add hover tooltip (zone code + label).

Add click to “select” a zone polygon and highlight it.

Legend:

In-map overlay card with the 5 zone categories and a colored dot.

Clicking a legend item toggles visibility for that zone category.

D4) Address geocoding on Update (server-side)
When Update is clicked:

If overview.siteAddress changed OR location.lat/lng missing:

Call Mapbox forward geocoding:

query = ${siteAddress}, ${city}, ${province}, Canada

If results:

set location.lat/lng

set geocodeConfidence based on Mapbox relevance / place_type (simple mapping acceptable)

set lastGeocodedAt

If fail:

keep existing coords (or none)

show toast warning “Couldn’t geocode address. You can still save; map will use default.”

Optional (nice-to-have but still within Feature 3):

Add “Re-geocode” button near address field (only sets a flag; still requires Update click).

Part E — Files to Create / Modify
Create
app/projects/[projectId]/page.tsx

app/projects/[projectId]/ProjectProfileClient.tsx

app/projects/[projectId]/actions.ts

components/maps/ZoningPlaceholderMap.tsx

lib/projects/profileTypes.ts (export ProjectProfileData)

lib/projects/profileDefaults.ts (default profile + default docsChecklist seed)

lib/maps/dummyZoning.ts (geojson generator)

lib/maps/geocode.ts (server helper)

Modify (as needed)
Supabase migrations folder (SQL above)

Ensure Projects list links to /projects/[projectId] (if not already)

Part F — Acceptance Criteria (must pass)
Loading

Visiting /projects/{id} loads project and profile.

If profile does not exist, it’s created with defaults and rendered.

Editing + manual save

Editing fields does not persist until Update clicked.

Update persists all sections and reload shows saved values.

Setup status

Setup banner correctly shows Draft vs Complete based on rules.

Setup status persists in DB and remains correct after reload.

Map behavior

If project has coords: map centers there and shows a pin + dummy zoning polygons + legend.

If no coords: map uses Coquitlam default center and shows helper message.

Hover shows zone tooltip; clicking a zone highlights it; legend toggles categories.

Geocoding

Changing address + clicking Update attempts geocode and updates map center when successful.

If geocode fails, save still succeeds and map falls back.

