-- Allow inserts via anon key (for job submissions and seed scripts)
DROP POLICY IF EXISTS "Allow insert jobs" ON public.jobs;
CREATE POLICY "Allow insert jobs" ON public.jobs FOR INSERT WITH CHECK (true);
