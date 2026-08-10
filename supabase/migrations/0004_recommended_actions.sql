ALTER TABLE public.project_status 
ADD COLUMN IF NOT EXISTS recommended_actions jsonb DEFAULT '[]'::jsonb;
