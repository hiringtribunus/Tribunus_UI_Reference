# Supabase Setup Guide

This document provides complete instructions for setting up Supabase for the Tribunus Labs UI project.

## Prerequisites

- A Supabase account (free tier works fine)
- Node.js and npm installed locally

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `tribunus-labs-ui` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose closest to your target users
   - **Pricing Plan**: Free tier is sufficient for MVP
4. Click "Create new project"
5. Wait 2-3 minutes for the project to provision

## Step 2: Get Your API Credentials

Once your project is ready:

1. Go to **Settings** > **API** in your Supabase dashboard
2. Find these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: A long JWT token starting with `eyJ...`
3. Copy these values - you'll need them in Step 5

## Step 3: Create the Database Schema

### Option A: Using SQL Editor (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy and paste the following SQL:

```sql
-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach trigger to projects table
drop trigger if exists trg_projects_set_updated_at on public.projects;

create trigger trg_projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

-- Create indexes for performance
create index if not exists idx_projects_name on public.projects using btree (name);
create index if not exists idx_projects_updated_at on public.projects using btree (updated_at desc);

-- Insert sample project for testing
insert into public.projects (name, address) values
  ('Downtown Office Complex', '123 Main St, San Francisco, CA 94102');
```

4. Click **Run** to execute the query
5. You should see "Success. No rows returned" message

### Option B: Using Migrations (For Production)

If you want version-controlled migrations:

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_ID
```

4. Create a migration:
```bash
supabase migration new create_projects_table
```

5. Edit the generated file in `supabase/migrations/` and paste the SQL from Option A

6. Apply migration:
```bash
supabase db push
```

## Step 4: Configure Row Level Security (RLS)

**For MVP**: We're skipping RLS to avoid auth complexity. The table is publicly accessible.

**For Production** (when adding auth later):

1. Go to **Authentication** > **Policies** in Supabase dashboard
2. Find the `projects` table
3. Click "Enable RLS"
4. Add policies:

```sql
-- Allow anyone to read projects (for now)
create policy "Enable read access for all users"
on public.projects for select
using (true);

-- Allow anyone to insert (will add user restriction later)
create policy "Enable insert for all users"
on public.projects for insert
with check (true);

-- Allow anyone to update (will add user restriction later)
create policy "Enable update for all users"
on public.projects for update
using (true);

-- Allow anyone to delete (will add user restriction later)
create policy "Enable delete for all users"
on public.projects for delete
using (true);
```

**Note**: These permissive policies should be tightened when you add authentication in Feature 3+.

## Step 5: Configure Environment Variables

1. Create a `.env.local` file in your project root:

```bash
touch .env.local
```

2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

3. Add `.env.local` to `.gitignore` (should already be there)

4. Restart your Next.js dev server:

```bash
npm run dev
```

## Step 6: Switch from Mock to Real Data

Once Supabase is configured, update the data layer to use real Supabase:

1. Open `lib/projects/queries.ts`
2. Find the comment `// SUPABASE INTEGRATION: Uncomment when ready`
3. Comment out the mock data calls
4. Uncomment the real Supabase calls

Example:

```typescript
// Before (mock data)
export async function getProjects(params: ProjectsQueryParams = {}) {
  return getMockProjects(params);
}

// After (real Supabase)
export async function getProjects(params: ProjectsQueryParams = {}) {
  const supabase = createServerClient();
  // ... real Supabase query
}
```

5. Do the same for `lib/projects/actions.ts`

## Step 7: Test the Connection

1. Open your app at `http://localhost:3000/projects`
2. Try creating a new project
3. Check the Supabase **Table Editor** > **projects** table
4. You should see your new project appear

## Step 8: Verify Data Persistence

1. Create, edit, and delete projects in the UI
2. Refresh the page - data should persist
3. Open the app in an incognito window - data should be visible

## Troubleshooting

### "Failed to fetch" or CORS errors

- Check your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify the URL includes `https://`
- Make sure the anon key is the **public anon key**, not the service role key

### "Row Level Security" errors

- RLS is currently disabled for MVP
- If you enabled it, make sure policies exist (see Step 4)
- Check policies in **Authentication** > **Policies**

### Data not persisting

- Check browser console for errors
- Verify environment variables are loaded: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
- Check Supabase logs in **Logs** > **Postgres Logs**

### "Invalid API key" errors

- Regenerate the anon key from **Settings** > **API**
- Update `.env.local` with the new key
- Restart the dev server

## Future Enhancements

### Adding User Authentication (Feature 3+)

When ready to add auth:

1. Add `owner_id uuid references auth.users` column to projects table
2. Enable RLS
3. Update policies to filter by `auth.uid() = owner_id`
4. Add Supabase Auth UI components

### Adding Storage (Feature 4+)

For uploading files (maps, documents):

1. Go to **Storage** in Supabase dashboard
2. Create a bucket called `project-files`
3. Set up policies for file access
4. Use `supabase.storage.from('project-files').upload()`

## Feature 4 — Project Sources (Data Sources Library)

> **When to run:** Defer this migration until Supabase is live so you can run it in the SQL Editor or CLI alongside enabling auth/RLS for the rest of the app.

Use the following migration to create enums, the `project_sources` table, indexes, and the updated_at trigger used throughout the schema:

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
```

### RLS Guidance

- Keep RLS **off** for this table until Supabase auth is live and policies can follow the same pattern as the `projects` table.
- Once auth is enabled, add owner-aware policies and re-enable RLS during the same deployment window.

### Storage Bucket and Object Keys

- Create a bucket named `project-sources`.
- Store uploads using the convention `${projectId}/${sourceId}/${file.name}` to keep per-project partitions organized.
- The bucket can be public or private; if private, serve files via signed URLs rather than direct public links.

### Realtime Subscriptions (Optional)

For live updates across users:

```typescript
supabase
  .channel('projects')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'projects' },
    (payload) => {
      console.log('Change received!', payload)
      // Update UI
    }
  )
  .subscribe()
```

---

## Feature 5 — Pro Forma / Scenario Planning

> **Status:** Database migration exists, but application currently uses mock data layer

### Migration File Location

The migration already exists at:
```
supabase/migrations/20241224000000_create_project_proformas.sql
```

### Migration Contents

```sql
create extension if not exists "pgcrypto";

create table if not exists public.project_proformas (
  project_id uuid primary key references public.projects(id) on delete cascade,
  updated_at timestamptz not null default now(),
  assumptions jsonb not null default '{}'::jsonb
);

create index if not exists project_proformas_updated_at_idx
on public.project_proformas(updated_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if not exists trg_project_proformas_set_updated_at on public.project_proformas;
create trigger trg_project_proformas_set_updated_at
before update on public.project_proformas
for each row execute function public.set_updated_at();
```

### To Enable Supabase for Feature 5

1. **Apply the migration**:
   - Option A: Run the SQL above in Supabase SQL Editor
   - Option B: Use Supabase CLI: `supabase db push`

2. **Uncomment Supabase code in `lib/proforma/queries.ts`**:
   - Find the commented Supabase implementation
   - Comment out the mock calls: `getMockProForma()`, `saveMockProForma()`, etc.
   - Uncomment the real Supabase query code

3. **Uncomment Supabase code in `lib/proforma/actions.ts`**:
   - Find the commented Supabase implementation
   - Comment out the mock save call
   - Uncomment the real Supabase upsert

4. **Test the integration**:
   - Navigate to `/proforma`
   - Select a project
   - Edit assumptions and save
   - Verify data persists in Supabase Table Editor

**Note:** Feature 5 is 100% functional with mock data, so enabling Supabase is optional until you need multi-device persistence.

---

## Complete Supabase TODO Checklist

### ✅ Already Complete
- [x] `projects` table migration (if using Supabase for projects)
- [x] `project_proformas` table migration file exists

### 🔴 Required for Feature 4 (Data Sources)

#### 1. Apply Feature 4 Migration
Run the SQL provided in the "Feature 4 — Project Sources" section above (lines 264-343).

#### 2. Create Storage Bucket
**Via Supabase Dashboard:**
1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Bucket name: `project-sources`
4. **Public bucket**: Choose `Public` for easier testing (recommended for MVP)
   - Files will be accessible via direct URL
   - Simpler to implement
5. **Private bucket**: Choose `Private` for production security
   - Requires signed URLs for access
   - More secure but adds complexity
6. Click **Create bucket**

**Object Key Convention:**
- All files should use path: `${projectId}/${sourceId}/${fileName}`
- Example: `abc123-456-789/source-uuid-123/council-report.pdf`

#### 3. Uncomment Supabase Code in Feature 4
**File: `lib/sources/queries.ts`**
- Find line ~40+ with comment `// SUPABASE INTEGRATION:`
- Comment out: `return getMockProjectSources(projectId, params);`
- Uncomment the Supabase query implementation below it

**File: `lib/sources/actions.ts`**
- Comment out all `createMockSource()`, `updateMockSource()`, `deleteMockSource()` calls
- Uncomment the real Supabase implementations

#### 4. Implement File Upload in AddSourceDialog
**File: `components/sources/dialogs/AddSourceDialog.tsx` (or `components/sources/AddSourceDialog.tsx` if using that one)**

Current code generates a mock path. Replace with real upload:

```typescript
// BEFORE (mock):
const storage_path = `mock/${projectId}/${crypto.randomUUID()}/${file.name}`;

// AFTER (real Supabase upload):
const sourceId = crypto.randomUUID();
const filePath = `${projectId}/${sourceId}/${file.name}`;

const supabase = createBrowserClient(); // Import from @/lib/supabase/client

const { data: uploadData, error: uploadError } = await supabase.storage
  .from('project-sources')
  .upload(filePath, file, {
    cacheControl: '3600',
    upsert: false
  });

if (uploadError) {
  setError(uploadError.message);
  return;
}

const storage_path = filePath; // Use this in createSource call
```

**Add upload progress (optional):**
```typescript
const { data, error } = await supabase.storage
  .from('project-sources')
  .upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    onUploadProgress: (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      setUploadProgress(percent);
    }
  });
```

#### 5. Implement File Download/Viewing

**For Public Bucket:**
```typescript
// In your table or actions menu component
const supabase = createBrowserClient();

const { data } = supabase.storage
  .from('project-sources')
  .getPublicUrl(source.storage_path);

const fileUrl = data.publicUrl;
// Use fileUrl to open in new tab or download
window.open(fileUrl, '_blank');
```

**For Private Bucket:**
```typescript
const supabase = createBrowserClient();

const { data, error } = await supabase.storage
  .from('project-sources')
  .createSignedUrl(source.storage_path, 3600); // 1 hour expiry

if (data) {
  window.open(data.signedUrl, '_blank');
}
```

#### 6. Implement File Deletion (Optional)
**File: `lib/sources/actions.ts`**

In the `deleteSource` function, add storage cleanup:

```typescript
// After deleting the database record
if (source.storage_path) {
  const supabase = createServerClient();
  await supabase.storage
    .from('project-sources')
    .remove([source.storage_path]);
  // Don't block on errors - best effort cleanup
}
```

### 🟡 Optional (Production Enhancements)

#### Enable RLS for Feature 4
Once authentication is implemented:

```sql
-- Enable RLS on project_sources table
alter table public.project_sources enable row level security;

-- Policy: Users can only read sources for their projects
create policy "Users can read their project sources"
on public.project_sources for select
using (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
  )
);

-- Policy: Users can insert sources for their projects
create policy "Users can insert sources to their projects"
on public.project_sources for insert
with check (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
  )
);

-- Policy: Users can update sources for their projects
create policy "Users can update their project sources"
on public.project_sources for update
using (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
  )
);

-- Policy: Users can delete sources for their projects
create policy "Users can delete their project sources"
on public.project_sources for delete
using (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
  )
);
```

#### Storage Bucket Policies (if using private bucket)
```sql
-- Allow authenticated users to upload to their project folders
create policy "Users can upload to their project folders"
on storage.objects for insert
with check (
  bucket_id = 'project-sources' and
  (storage.foldername(name))[1] in (
    select id::text from public.projects where owner_id = auth.uid()
  )
);

-- Allow users to read files from their project folders
create policy "Users can read their project files"
on storage.objects for select
using (
  bucket_id = 'project-sources' and
  (storage.foldername(name))[1] in (
    select id::text from public.projects where owner_id = auth.uid()
  )
);

-- Allow users to delete files from their project folders
create policy "Users can delete their project files"
on storage.objects for delete
using (
  bucket_id = 'project-sources' and
  (storage.foldername(name))[1] in (
    select id::text from public.projects where owner_id = auth.uid()
  )
);
```

---

## Summary of Implementation Status

| Feature | Database | Storage | Code Integration | Status |
|---------|----------|---------|------------------|--------|
| **Feature 4 (Sources)** | ❌ Migration not applied | ❌ Bucket not created | ⚠️ Code commented out | **Needs Setup** |
| **Feature 5 (Pro Forma)** | ✅ Migration file exists | N/A | ⚠️ Using mock (optional) | **Optional** |
| **Feature 6 (AI Chat)** | N/A (uses localStorage) | N/A | ✅ Complete | **Done** |

### Quick Start Checklist

To enable full Supabase integration:

1. **Feature 4 Prerequisites:**
   - [ ] Run Feature 4 migration SQL in Supabase
   - [ ] Create `project-sources` storage bucket (public or private)
   - [ ] Uncomment Supabase code in `lib/sources/queries.ts`
   - [ ] Uncomment Supabase code in `lib/sources/actions.ts`
   - [ ] Implement file upload in `AddSourceDialog.tsx`
   - [ ] Test file upload/download flow
   - [ ] (Optional) Implement file deletion

2. **Feature 5 Prerequisites:**
   - [ ] Run Feature 5 migration SQL in Supabase (if not already done)
   - [ ] Uncomment Supabase code in `lib/proforma/queries.ts`
   - [ ] Uncomment Supabase code in `lib/proforma/actions.ts`
   - [ ] Test save/load flow

3. **Production Hardening (Later):**
   - [ ] Enable RLS on all tables
   - [ ] Add storage bucket policies
   - [ ] Implement signed URLs if using private bucket
   - [ ] Add error logging for failed uploads/deletes

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)

## Support

- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: [https://github.com/supabase/supabase/issues](https://github.com/supabase/supabase/issues)
