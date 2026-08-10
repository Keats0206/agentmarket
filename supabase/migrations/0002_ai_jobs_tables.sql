-- AI Jobs Directory tables (consolidated into AgentMarket Supabase)

CREATE TABLE IF NOT EXISTS public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    website text,
    logo_url text,
    description text,
    verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    title text NOT NULL,
    slug text NOT NULL,
    location text DEFAULT 'Remote',
    is_remote boolean DEFAULT true,
    job_type text DEFAULT 'Full-time',
    salary_min integer,
    salary_max integer,
    currency text DEFAULT 'USD',
    tags text[] DEFAULT '{}',
    description text NOT NULL,
    apply_url text NOT NULL,
    source text DEFAULT 'curated',
    is_featured boolean DEFAULT false,
    featured_until timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    status text DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_session_id text UNIQUE,
    employer_email text NOT NULL,
    job_id uuid REFERENCES public.jobs(id),
    amount_cents integer NOT NULL,
    status text DEFAULT 'pending',
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS jobs_featured_created_idx ON public.jobs (is_featured DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON public.jobs (status);
CREATE INDEX IF NOT EXISTS jobs_slug_idx ON public.jobs (slug);

-- RLS (public read)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read companies" ON public.companies;
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read jobs" ON public.jobs;
CREATE POLICY "Public read jobs" ON public.jobs FOR SELECT USING (true);
