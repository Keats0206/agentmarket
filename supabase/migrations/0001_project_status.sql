-- Project Status table for Keating Holdings dashboard
-- Each row represents one portfolio project's current state
-- Populated by Hermes cron jobs, consumed by the dashboard

CREATE TABLE IF NOT EXISTS public.project_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_slug text UNIQUE NOT NULL,
  project_name text NOT NULL,
  domain text,
  vercel_project_id text,
  github_repo text,
  analytics_pageviews_30d integer DEFAULT 0,
  analytics_visitors_30d integer DEFAULT 0,
  sparkline_data jsonb DEFAULT '[]'::jsonb,
  top_pages jsonb DEFAULT '[]'::jsonb,
  revenue_total_cents integer DEFAULT 0,
  revenue_last_30d_cents integer DEFAULT 0,
  revenue_currency text DEFAULT 'usd',
  hermes_last_active timestamptz,
  hermes_running_crons text[] DEFAULT '{}',
  hermes_recent_work text,
  deploy_last_at timestamptz,
  deploy_status text DEFAULT 'unknown',
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'retired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_status_slug ON public.project_status(project_slug);
CREATE INDEX IF NOT EXISTS idx_project_status_status ON public.project_status(status);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_project_status_updated ON public.project_status;
CREATE TRIGGER on_project_status_updated
  BEFORE UPDATE ON public.project_status
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS: anyone can read, only service_role can write
ALTER TABLE public.project_status ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON public.project_status;
CREATE POLICY "Public read access"
  ON public.project_status FOR SELECT
  USING (true);