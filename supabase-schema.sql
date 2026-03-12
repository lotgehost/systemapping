-- System Mapper — Supabase Schema
-- Run this in your Supabase SQL editor

-- Projects table
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  prompt      text not null,
  nodes       jsonb not null default '[]',
  edges       jsonb not null default '[]',
  sources     jsonb not null default '[]',
  share_slug  text unique,
  status      text not null default 'pending', -- pending | generating | ready | error
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Uploads table
create table if not exists uploads (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid references projects(id) on delete cascade,
  file_name      text not null,
  storage_key    text not null,
  extracted_text text,
  created_at     timestamptz not null default now()
);

-- Indexes
create index if not exists projects_share_slug_idx on projects (share_slug);
create index if not exists uploads_project_id_idx on uploads (project_id);

-- Auto-update updated_at trigger
create or replace function touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_updated_at on projects;
create trigger projects_updated_at
  before update on projects
  for each row execute function touch_updated_at();

-- RLS (open access for MVP — no auth)
alter table projects enable row level security;
create policy "open_access_projects" on projects for all using (true) with check (true);

alter table uploads enable row level security;
create policy "open_access_uploads" on uploads for all using (true) with check (true);

-- Storage bucket (run separately in Storage dashboard or via Storage API)
-- Bucket name: uploads
-- Public: false
-- Allowed MIME types: application/pdf, text/plain
-- Max file size: 10485760 (10 MB)
