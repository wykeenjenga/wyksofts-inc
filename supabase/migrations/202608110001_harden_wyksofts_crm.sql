revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

drop policy if exists "Admins can read project inquiries" on public.wyksofts_inquiries;
create policy "Admins can read project inquiries"
on public.wyksofts_inquiries for select to authenticated
using (lower(((select auth.jwt()) ->> 'email')) = 'hello@wyksoftsinc.com');

drop policy if exists "Admins can update project inquiries" on public.wyksofts_inquiries;
create policy "Admins can update project inquiries"
on public.wyksofts_inquiries for update to authenticated
using (lower(((select auth.jwt()) ->> 'email')) = 'hello@wyksoftsinc.com')
with check (lower(((select auth.jwt()) ->> 'email')) = 'hello@wyksoftsinc.com');

drop policy if exists "Admins can read job applications" on public.wyksofts_job_applications;
create policy "Admins can read job applications"
on public.wyksofts_job_applications for select to authenticated
using (lower(((select auth.jwt()) ->> 'email')) = 'hello@wyksoftsinc.com');

drop policy if exists "Admins can update job applications" on public.wyksofts_job_applications;
create policy "Admins can update job applications"
on public.wyksofts_job_applications for update to authenticated
using (lower(((select auth.jwt()) ->> 'email')) = 'hello@wyksoftsinc.com')
with check (lower(((select auth.jwt()) ->> 'email')) = 'hello@wyksoftsinc.com');
