CREATE TABLE IF NOT EXISTS public.cron_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text NOT NULL,
  name text NOT NULL,
  schedule text NOT NULL,
  next_run_at timestamptz,
  last_run_at timestamptz,
  last_status text,
  enabled boolean DEFAULT true,
  project text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.cron_schedule ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read cron" ON public.cron_schedule;
CREATE POLICY "Public read cron" ON public.cron_schedule FOR SELECT USING (true);
