-- Migration: Allow public technician registration applications
-- Public users can insert technician applications ONLY with published = false, verified = false, and is_demo = false.

create policy "Allow public to submit registration applications"
  on public.technicians for insert
  with check (published = false and verified = false and is_demo = false);

create policy "Allow public to insert technician services for unverified registrations"
  on public.technician_services for insert
  with check (
    exists (
      select 1 from public.technicians
      where technicians.id = technician_services.technician_id
        and technicians.published = false
    )
  );
