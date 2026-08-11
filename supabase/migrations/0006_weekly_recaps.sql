CREATE TABLE IF NOT EXISTS public.weekly_recaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL,
  week_end date NOT NULL,
  content text NOT NULL,
  highlights jsonb DEFAULT '[]'::jsonb,
  lowlights jsonb DEFAULT '[]'::jsonb,
  metrics jsonb DEFAULT '{}'::jsonb,
  next_week_priorities jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.weekly_recaps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read recaps" ON public.weekly_recaps;
CREATE POLICY "Public read recaps" ON public.weekly_recaps FOR SELECT USING (true);
