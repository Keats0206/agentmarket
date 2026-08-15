-- Affiliate tracking for Hot100AI monetization
-- Records every outbound affiliate click with UTM-style tracking

CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug text NOT NULL,
  destination_url text NOT NULL,
  referer text,
  user_agent text,
  ip_hash text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_tool_slug ON public.affiliate_clicks(tool_slug, created_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created ON public.affiliate_clicks(created_at);

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert affiliate_clicks" ON public.affiliate_clicks;
CREATE POLICY "Public insert affiliate_clicks" ON public.affiliate_clicks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service read affiliate_clicks" ON public.affiliate_clicks;
CREATE POLICY "Service read affiliate_clicks" ON public.affiliate_clicks FOR SELECT USING (true);

-- Add affiliate_url column to tools table
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS affiliate_url text;

-- Add affiliate_enabled flag
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS affiliate_enabled boolean DEFAULT false;

-- View for affiliate performance (used by dashboard)
DROP VIEW IF EXISTS public.affiliate_performance;
CREATE VIEW public.affiliate_performance AS
SELECT
  tool_slug,
  COUNT(*) as total_clicks,
  COUNT(*) FILTER (WHERE created_at > now() - interval '7 days') as clicks_7d,
  COUNT(*) FILTER (WHERE created_at > now() - interval '30 days') as clicks_30d
FROM public.affiliate_clicks
GROUP BY tool_slug;