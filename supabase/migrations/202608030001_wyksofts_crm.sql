create table if not exists public.wyksofts_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text,
  company text,
  project_type text not null,
  budget text not null,
  timeline text not null,
  message text not null check (char_length(message) between 10 and 5000),
  source text not null default 'website',
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'shortlisted', 'closed')),
  admin_notes text
);

create table if not exists public.wyksofts_job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  role text not null,
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text,
  location text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  resume_url text,
  years_experience text not null,
  cover_note text not null check (char_length(cover_note) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'shortlisted', 'closed')),
  admin_notes text
);

alter table public.wyksofts_inquiries enable row level security;
alter table public.wyksofts_job_applications enable row level security;

revoke all on table public.wyksofts_inquiries from anon, authenticated;
revoke all on table public.wyksofts_job_applications from anon, authenticated;

grant insert (name, email, phone, company, project_type, budget, timeline, message, source)
  on public.wyksofts_inquiries to anon, authenticated;
grant insert (role, name, email, phone, location, linkedin_url, github_url, portfolio_url, resume_url, years_experience, cover_note)
  on public.wyksofts_job_applications to anon, authenticated;

grant select, update on public.wyksofts_inquiries to authenticated;
grant select, update on public.wyksofts_job_applications to authenticated;

create policy "Anyone can submit a project inquiry"
on public.wyksofts_inquiries for insert to anon, authenticated
with check (status = 'new' and admin_notes is null);

create policy "Admins can read project inquiries"
on public.wyksofts_inquiries for select to authenticated
using (lower((select auth.jwt() ->> 'email')) = 'hello@wyksoftsinc.com');

create policy "Admins can update project inquiries"
on public.wyksofts_inquiries for update to authenticated
using (lower((select auth.jwt() ->> 'email')) = 'hello@wyksoftsinc.com')
with check (lower((select auth.jwt() ->> 'email')) = 'hello@wyksoftsinc.com');

create policy "Anyone can submit a job application"
on public.wyksofts_job_applications for insert to anon, authenticated
with check (status = 'new' and admin_notes is null);

create policy "Admins can read job applications"
on public.wyksofts_job_applications for select to authenticated
using (lower((select auth.jwt() ->> 'email')) = 'hello@wyksoftsinc.com');

create policy "Admins can update job applications"
on public.wyksofts_job_applications for update to authenticated
using (lower((select auth.jwt() ->> 'email')) = 'hello@wyksoftsinc.com')
with check (lower((select auth.jwt() ->> 'email')) = 'hello@wyksoftsinc.com');

create index if not exists wyksofts_inquiries_created_at_idx on public.wyksofts_inquiries (created_at desc);
create index if not exists wyksofts_inquiries_status_idx on public.wyksofts_inquiries (status);
create index if not exists wyksofts_job_applications_created_at_idx on public.wyksofts_job_applications (created_at desc);
create index if not exists wyksofts_job_applications_status_idx on public.wyksofts_job_applications (status);
