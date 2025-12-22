# Feature 2 — Projects: List + CRUD (Implementation Spec)

## Objective
Implement the Projects experience (Google Drive-like):
- Projects index page with Grid/List views
- Create Project modal
- Rename + Delete actions
- Search + Sort
- Persistence via Supabase (Postgres). No auth required in this feature.

---

## PART A — Data Model (Supabase)

### A1) Table schema (SQL migration)
Create `public.projects` (Supabase Postgres). Add this migration under `supabase/migrations/<timestamp>_create_projects.sql` (or equivalent).

```sql
-- Enable UUID generation if not already available
create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_set_updated_at on public.projects;

create trigger trg_projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

-- NOTE (MVP): keep RLS OFF for now to avoid auth work in this feature.
-- Later: enable RLS + owner_id + policies.
A2) Minimal indexes (optional but recommended)
sql
Copy code
create index if not exists idx_projects_name on public.projects using btree (name);
create index if not exists idx_projects_updated_at on public.projects using btree (updated_at desc);
PART B — Supabase Client Utilities (Next.js App Router)
B1) Env vars
Ensure .env.local includes:

NEXT_PUBLIC_SUPABASE_URL=...

NEXT_PUBLIC_SUPABASE_ANON_KEY=...

B2) Supabase client helpers
If not present, create:

lib/supabase/client.ts

Browser client for any client-side reads (try to keep most DB work server-side)

lib/supabase/server.ts

Server client for Server Components + Server Actions

Implementation requirements:

Use @supabase/supabase-js.

If repo already uses @supabase/ssr, follow that pattern; otherwise keep it simple (no auth cookies needed for this feature).

PART C — Projects Data Access Layer
C1) Types
Create lib/projects/types.ts:

Project type mirroring DB columns

Input DTOs:

CreateProjectInput { name: string; address?: string | null }

RenameProjectInput { id: string; name: string }

DeleteProjectInput { id: string }

C2) Query function
Create lib/projects/queries.ts:

getProjects(params) requirements:

Inputs:

q?: string (search)

sort?: "updated_desc" | "created_desc" | "name_asc"

limit?: number (default 100)

Behavior:

Search should filter by name OR address (case-insensitive).

Default sort: updated_at desc.

Output:

Project[]

Supabase query behavior:

Use .ilike() for search.

Use .order() for sorting.

Use .limit().

C3) Server Actions (mutations)
Create lib/projects/actions.ts with 'use server' at top.

Implement:

createProject(input: CreateProjectInput): Promise<{ project?: Project; error?: string }>

Validate via Zod (name required, trimmed, min 2, max 80; address optional max 200).

Insert row; return inserted project.

Revalidate relevant paths:

/projects

renameProject(input: RenameProjectInput): Promise<{ project?: Project; error?: string }>

Validate name same as above.

Update by id; return updated project.

Revalidate /projects and /projects/[projectId] (if route exists).

deleteProject(input: DeleteProjectInput): Promise<{ ok?: true; error?: string }>

Delete by id.

Revalidate /projects.

Error handling requirements:

Return a clean string error (no raw Supabase error object).

If id is invalid UUID, return Invalid project id.

PART D — UI/UX (Projects Index)
D1) Route + Server Component Page
Implement app/(app)/projects/page.tsx as a Server Component.

It must:

Read searchParams:

q (string)

sort (enum)

view ("grid" | "list")

Call getProjects({ q, sort }).

Render:

<ProjectsToolbar /> (client)

conditional <ProjectsGrid /> or <ProjectsList /> based on view

empty state if 0 projects

Default params:

view=grid

sort=updated_desc

D2) URL-driven state (Drive-like shareable UI)
Toolbar must update URL query params (not internal-only state):

typing search updates q

sort dropdown updates sort

view toggle updates view
Implementation requirement:

Use router.replace() to update query params.

Debounce search input (250–400ms).

Preserve other params when updating one.

D3) Toolbar component (client)
Create components/projects/ProjectsToolbar.tsx (client):

Left: page title optional (TopBar already shows title; keep toolbar clean)

Main controls:

Search input (placeholder: Search projects)

Sort dropdown:

Last modified -> updated_desc (default)

Date created -> created_desc

Name (A–Z) -> name_asc

View toggle buttons:

Grid icon

List icon

Right:

New Project button opens create modal

Use shadcn/ui:

Input, Button, DropdownMenu, Separator (optional)

D4) Projects Grid (Drive cards)
Create components/projects/ProjectsGrid.tsx:

Responsive grid:

grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

Each card uses a “Drive-like” surface:

subtle border, rounded corners, hover background, tiny elevation on hover

Card content:

Project name (truncate)

Address (truncate, muted; if missing show —)

Last modified (relative time optional; otherwise date)

Card click behavior:

Navigate to /projects/[projectId] (stub route in Part F).

Card actions:

... dropdown menu with:

Rename

Delete

D5) Projects List (Drive list)
Create components/projects/ProjectsList.tsx:

Table-like list using shadcn Table OR simple div rows

Columns:

Name

Address

Last modified

Actions

Row click navigates to /projects/[projectId]

Row hover highlights with subtle background

Actions dropdown identical to grid

D6) Create Project modal
Create components/projects/CreateProjectDialog.tsx (client):

Form fields:

name (required)

address (optional)

Submit calls server action createProject.

UX requirements:

Disable submit while pending

On success:

close dialog

route to /projects/[projectId] (optional) OR stay on list and refresh (required)

On error:

display inline error message (single line)

Use shadcn/ui:

Dialog, DialogContent, DialogHeader, DialogFooter

D7) Rename modal
Create components/projects/RenameProjectDialog.tsx (client):

Opens with current name prefilled

Calls renameProject({ id, name })

Close on success; show error on failure

Important (shadcn best practice):

If opening dialogs from a dropdown menu, use:

DropdownMenu modal={false} OR wrap dropdown inside dialog controller

Manage dialog open state in component (do NOT rely on nested dialog triggers)

D8) Delete confirm
Create components/projects/DeleteProjectDialog.tsx using AlertDialog:

Confirm copy:

Title: Delete project?

Description: This will permanently delete this project.

Calls deleteProject({ id })

Close on success; refresh list

D9) Actions menu component
Create components/projects/ProjectActionsMenu.tsx:

Props: { project: Project }

Renders dropdown + controls rename/delete dialogs via local state

Works for both grid cards and list rows

PART E — Search, Sort, and Edge Cases
E1) Search behavior
Search should match:

name OR address

If q is empty or missing, return all projects.

E2) Sorting behavior
Default: updated_at desc

Options:

updated_at desc

created_at desc

name asc (case-insensitive ordering acceptable; if needed use order('name', { ascending: true }))

E3) Empty state
If no projects:

Show centered state with:

Title: No projects yet

Subtitle: Create your first project to get started.

Button: New Project (opens create dialog)

E4) Loading state
Use Server Component fetch, so page loads with data; optionally add:

skeleton cards/rows while navigation updates params (client transitions)

PART F — Minimal Project Route Stub (required for navigation continuity)
Create app/(app)/projects/[projectId]/page.tsx (Server Component) as a stub ONLY:

Fetch project by id (single row) and render:

<h1> project name

Coming soon.

NO map, NO editable profile fields (that is Feature 3).

Implement a helper in lib/projects/queries.ts:

getProjectById(id: string): Promise<Project | null>

If id invalid, render a simple not-found UI.

PART G — Modular Execution Checklist (for AI coding agent)
G1) DB
 Add migration for projects table + updated_at trigger

 Apply migration

G2) Supabase utilities
 Add env vars plumbing

 Implement lib/supabase/server.ts and lib/supabase/client.ts (or adapt existing)

G3) Data layer
 Add types.ts

 Add queries.ts (list + single)

 Add actions.ts (create/rename/delete) with Zod validation + revalidatePath

G4) UI components
 ProjectsToolbar (URL param state)

 ProjectsGrid + ProjectCard

 ProjectsList + row UI

 ProjectActionsMenu + RenameProjectDialog + DeleteProjectDialog

 CreateProjectDialog

G5) Routes
 Implement /projects page server component + empty state

 Implement /projects/[projectId] stub page

G6) QA
 Create → appears in list; refresh works; route stub loads

 Rename → updates immediately after refresh

 Delete → removed from list

 Search + sort + view persist in URL and work

 No console errors; dialogs accessible; dropdown+dialog works reliably