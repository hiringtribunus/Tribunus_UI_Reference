# Feature 04 — Data Sources: Project Library (Placeholder)

## Objective
Implement a per-project **Data Sources** library page that lets a developer attach “evidence/context” to a project (council reports, news articles, zoning/map links, bylaws/policies, etc.). Support:
- List view with metadata + filters
- Add Source via **URL** and **File Upload** (Supabase Storage)
- Edit metadata (rename, tags, dates, type)
- Delete source
This library becomes the canonical data store that future AI agents will read from.

---

## Part A — Data Model (Supabase)

### A1) Create table: `project_sources`
Create a dedicated table so every source is a first-class entity linked to a project.

**SQL Migration**
```sql
create extension if not exists "pgcrypto";

-- enums (optional; if you prefer text columns, skip enums)
do $$ begin
  create type public.source_kind as enum (
    'council_report',
    'news',
    'zoning_map',
    'bylaw_policy',
    'staff_report',
    'minutes_agenda',
    'market_data',
    'other'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.source_format as enum ('url','file');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ingestion_status as enum ('not_ingested','queued','done','error');
exception when duplicate_object then null;
end $$;

create table if not exists public.project_sources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,

  kind public.source_kind not null default 'other',
  format public.source_format not null default 'url',

  title text not null,
  url text null,
  storage_path text null,          -- Supabase Storage object key if format=file
  mime_type text null,
  file_size_bytes bigint null,

  publisher text null,             -- e.g., City, Publisher name
  published_at date null,          -- for news / bylaw / staff report publication date

  -- dev/council-specific metadata (optional but critical later)
  meeting_date date null,
  meeting_body text null,          -- e.g., "Regular Council", "Public Hearing", etc.
  agenda_item text null,           -- agenda item label / section
  project_ref text null,           -- e.g., "PROJ 21-065" or similar

  tags text[] not null default '{}'::text[],
  notes text null,

  status text not null default 'active' check (status in ('active','archived')),

  -- future AI pipeline fields (do not build ingestion now; just store)
  ingestion public.ingestion_status not null default 'not_ingested',
  content_text text null,          -- future extracted OCR/text
  content_json jsonb not null default '{}'::jsonb, -- future structured extraction

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_sources_project_id_idx on public.project_sources(project_id);
create index if not exists project_sources_kind_idx on public.project_sources(kind);
create index if not exists project_sources_updated_at_idx on public.project_sources(updated_at desc);
create index if not exists project_sources_tags_gin_idx on public.project_sources using gin(tags);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_project_sources_set_updated_at on public.project_sources;
create trigger trg_project_sources_set_updated_at
before update on public.project_sources
for each row execute function public.set_updated_at();
A2) MVP security note
If your repo currently runs without auth/RLS: leave RLS off for this table.

If auth/RLS is enabled (owner_id on projects): add policies mirroring the pattern used for project_profiles.

Part B — Storage (Supabase Storage)
B1) Create bucket
Create a bucket named:

project-sources

MVP settings (vibe-coding friendly):

bucket can be public OR private.

If private, implement signed URLs for downloads.

B2) Storage object key convention
Always upload files under:

${projectId}/${sourceId}/${originalFileName}

Reason: stable partitioning per project, supports multiple files per project, easy cleanup.

Part C — Backend: Queries + Server Actions
C1) Types
Create lib/sources/types.ts:

ts
Copy code
export type SourceKind =
  | "council_report"
  | "news"
  | "zoning_map"
  | "bylaw_policy"
  | "staff_report"
  | "minutes_agenda"
  | "market_data"
  | "other";

export type SourceFormat = "url" | "file";

export type ProjectSource = {
  id: string;
  project_id: string;
  kind: SourceKind;
  format: SourceFormat;
  title: string;
  url: string | null;
  storage_path: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  publisher: string | null;
  published_at: string | null; // ISO date
  meeting_date: string | null; // ISO date
  meeting_body: string | null;
  agenda_item: string | null;
  project_ref: string | null;
  tags: string[];
  notes: string | null;
  status: "active" | "archived";
  ingestion: "not_ingested" | "queued" | "done" | "error";
  created_at: string;
  updated_at: string;
};

export type CreateSourceInput =
  | {
      kind: SourceKind;
      format: "url";
      title: string;
      url: string;
      publisher?: string | null;
      published_at?: string | null;
      meeting_date?: string | null;
      meeting_body?: string | null;
      agenda_item?: string | null;
      project_ref?: string | null;
      tags?: string[];
      notes?: string | null;
    }
  | {
      kind: SourceKind;
      format: "file";
      title: string;
      storage_path: string;
      mime_type?: string | null;
      file_size_bytes?: number | null;
      publisher?: string | null;
      published_at?: string | null;
      meeting_date?: string | null;
      meeting_body?: string | null;
      agenda_item?: string | null;
      project_ref?: string | null;
      tags?: string[];
      notes?: string | null;
    };

export type UpdateSourceInput = Partial<Omit<ProjectSource, "id" | "project_id" | "created_at" | "updated_at">> & {
  id: string;
};

export type ListSourcesParams = {
  q?: string;
  kind?: SourceKind | "all";
  sort?: "updated_desc" | "created_desc" | "title_asc" | "published_desc" | "meeting_desc";
  status?: "active" | "archived" | "all";
};
C2) Validation (Zod)
Create lib/sources/validation.ts:

title: trim, min 2, max 120

url: valid URL for format=url

tags: parse from comma input; each tag trim; max 20 tags; each tag max 32 chars

dates: allow YYYY-MM-DD only

C3) Queries
Create lib/sources/queries.ts:

getProjectSources(projectId, params): Promise<ProjectSource[]>

Search: match title, publisher, notes, url, project_ref

Filter: kind, status

Sort mapping:

updated_desc: updated_at desc (default)

created_desc: created_at desc

title_asc: title asc

published_desc: published_at desc nulls last

meeting_desc: meeting_date desc nulls last

C4) Server Actions
Create lib/sources/actions.ts ('use server'):

createSource(projectId: string, input: CreateSourceInput)

validate

insert into project_sources

revalidate:

/projects/[projectId]/sources

updateSource(projectId: string, input: UpdateSourceInput)

validate allowed fields

update row

revalidate sources page

deleteSource(projectId: string, sourceId: string)

delete row

(optional) delete storage object if storage_path exists (best-effort)

revalidate sources page

Important: Do NOT implement any parsing/ingestion. Keep ingestion = not_ingested always for now.

Part D — Routing + Page
D1) Route
Create:

app/projects/[projectId]/sources/page.tsx

This page must:

Load project basic info (name) for header context

Fetch sources via getProjectSources(projectId, searchParams)

Render:

ProjectSourcesToolbar (client)

ProjectSourcesTable (client OR server; recommended server list with client interactions via URL params)

empty state

D2) URL Query Params (shareable state)
Use searchParams:

q (string)

kind (SourceKind | "all")

status ("active" | "archived" | "all")

sort ("updated_desc" | "created_desc" | "title_asc" | "published_desc" | "meeting_desc")

Default:

kind=all

status=active

sort=updated_desc

Part E — UI Components
E1) Toolbar
Create components/sources/ProjectSourcesToolbar.tsx (client):

Search input (debounced 300ms; updates q)

Kind filter dropdown

Status filter dropdown

Sort dropdown

Right side:

Add Source button opens dialog

All changes update query params via router.replace() while preserving other params.

E2) Add Source Dialog
Create components/sources/AddSourceDialog.tsx (client):

Tabs: Link / File

Common fields:

Kind (select)

Title (text)

Tags (comma-separated input)

Notes (textarea)

Advanced metadata (collapsible):

Publisher

Published date

Meeting date

Meeting body

Agenda item

Project ref (PROJ #)

Link tab:

URL (required)

File tab:

File picker (required)

Upload button triggers upload to Supabase Storage:

Create sourceId first (client generates uuid)

Upload to project-sources/${projectId}/${sourceId}/${file.name}

On success call createSource server action with format=file and storage_path

Show upload progress + disable submit while uploading

Use shadcn/ui:

Dialog, Tabs, Input, Textarea, Select, Button, Accordion/Collapsible

E3) Table/List View
Create components/sources/ProjectSourcesTable.tsx:

Use list rows (Drive-like) or Table.

Columns (minimum):

Type (icon + kind label)

Title

Key date (choose best available):

if meeting_date exists show it

else if published_at exists show it

else show —

Added/Updated (relative optional; else date)

Actions

Row content:

Subtitle line: publisher + project_ref + url hostname (if present)

Tags as small chips (max 3 visible; “+N” overflow)

Badges:

Format: URL/File

Ingestion: “Not ingested” (always in this feature)

Row click:

If url exists: open in new tab

Else if file: open file:

if bucket public: direct public URL

if bucket private: request signed URL (implement helper)

E4) Actions Menu (per row)
Create components/sources/SourceActionsMenu.tsx:

Open

Edit metadata (opens EditSourceDialog)

Archive/Unarchive (status toggle)

Delete (confirm)

E5) Edit Source Dialog
Create components/sources/EditSourceDialog.tsx:

Same fields as add (minus format + storage path)

Save calls updateSource

E6) Delete Confirm
Use AlertDialog:

Title: Delete source?

Description: This will remove the source from this project.

Confirm calls deleteSource

E7) Empty State
If no sources:

Title: No sources yet

Subtitle: Add council reports, news, maps, or policies to build project context.

Button: Add Source

Part F — Modular Execution Tasks (AI Agent Checklist)
F1) DB + Storage
 Add migration for project_sources table + indexes + trigger

 Create project-sources bucket

 Decide bucket public vs private (if private, implement signed URLs)

F2) Data Layer
 lib/sources/types.ts

 lib/sources/validation.ts (Zod)

 lib/sources/queries.ts (list + filters + sorts)

 lib/sources/actions.ts (create/update/delete + revalidate)

F3) Routes
 app/projects/[projectId]/sources/page.tsx (fetch + render)

 Ensure Projects list links include a way to reach Sources page (optional in this feature)

F4) UI Components
 Toolbar (URL param state + debounce)

 AddSourceDialog (tabs link/file + upload)

 Table/List view + row UI

 Actions menu + Edit dialog + Delete confirm

 Empty state

F5) QA
 Add URL source → appears immediately with correct metadata

 Upload file → stored in bucket, DB row created, row opens file

 Search/filter/sort reflect in URL and work

 Edit updates metadata

 Archive hides under active filter

 Delete removes row (and deletes storage object best-effort)