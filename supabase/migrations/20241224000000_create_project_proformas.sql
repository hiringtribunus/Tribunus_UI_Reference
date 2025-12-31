-- Migration: Create project_proformas table
-- Feature 5: Pro Forma / Scenario Planning

create extension if not exists "pgcrypto";

-- Create project_proformas table
create table if not exists public.project_proformas (
  project_id uuid primary key references public.projects(id) on delete cascade,
  updated_at timestamptz not null default now(),
  assumptions jsonb not null default '{}'::jsonb
);

-- Create index on updated_at for sorting
create index if not exists project_proformas_updated_at_idx
on public.project_proformas(updated_at desc);

-- Create or reuse the updated_at trigger function
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger to auto-update updated_at on row updates
drop trigger if exists trg_project_proformas_set_updated_at on public.project_proformas;
create trigger trg_project_proformas_set_updated_at
before update on public.project_proformas
for each row execute function public.set_updated_at();

-- RLS policies (mirror pattern from project_profiles)
-- Only enable if your app uses RLS; otherwise skip this section

-- Enable RLS on the table
-- alter table public.project_proformas enable row level security;

-- Policy: Users can read their own project pro formas
-- create policy "read own project_proformas"
-- on public.project_proformas
-- for select
-- using (
--   exists (
--     select 1
--     from public.projects p
--     where p.id = project_proformas.project_id
--       and p.owner_id = auth.uid()
--   )
-- );

-- Policy: Users can insert pro formas for their own projects
-- create policy "insert own project_proformas"
-- on public.project_proformas
-- for insert
-- with check (
--   exists (
--     select 1
--     from public.projects p
--     where p.id = project_proformas.project_id
--       and p.owner_id = auth.uid()
--   )
-- );

-- Policy: Users can update their own project pro formas
-- create policy "update own project_proformas"
-- on public.project_proformas
-- for update
-- using (
--   exists (
--     select 1
--     from public.projects p
--     where p.id = project_proformas.project_id
--       and p.owner_id = auth.uid()
--   )
-- )
-- with check (
--   exists (
--     select 1
--     from public.projects p
--     where p.id = project_proformas.project_id
--       and p.owner_id = auth.uid()
--   )
-- );
