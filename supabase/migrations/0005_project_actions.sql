CREATE TABLE IF NOT EXISTS public.project_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_slug text NOT NULL,
  title text NOT NULL,
  description text,
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done', 'delegated')),
  category text DEFAULT 'growth' CHECK (category IN ('growth', 'fix', 'content', 'revenue', 'seo')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_actions_slug ON public.project_actions(project_slug, status);

ALTER TABLE public.project_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read actions" ON public.project_actions;
CREATE POLICY "Public read actions" ON public.project_actions FOR SELECT USING (true);
