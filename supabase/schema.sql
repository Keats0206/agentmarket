-- ============================================================================
-- Hot 100 AI Database Schema
-- Run this in Supabase SQL Editor to set up the database
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Accounts ───────────────────────────────────────────────────────────────
create table if not exists public.accounts (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  stripe_customer_id text unique,
  created_at timestamptz default now() not null
);

-- ─── Tools ──────────────────────────────────────────────────────────────────
create table if not exists public.tools (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  short_description text not null,
  description text not null,
  category text not null check (category in ('agent', 'mcp-server', 'framework', 'infra', 'platform')),
  subcategories jsonb default '[]'::jsonb,
  use_cases jsonb default '[]'::jsonb,
  integrations jsonb default '[]'::jsonb,
  pricing_model text not null check (pricing_model in ('Free', 'Open Source', 'Freemium', 'Paid', 'Enterprise')),
  pricing text,
  github_url text,
  github_stars int,
  website_url text not null,
  docs_url text,
  featured boolean default false,
  sponsored_tier text check (sponsored_tier in ('basic', 'category', 'premium')),
  last_updated date,
  pros jsonb default '[]'::jsonb,
  cons jsonb default '[]'::jsonb,
  setup_complexity text check (setup_complexity in ('Low', 'Medium', 'High')),
  maturity text check (maturity in ('Early', 'Growing', 'Mature')),
  account_id uuid references public.accounts(id) on delete set null,
  status text default 'published' check (status in ('draft', 'pending_review', 'published')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Index for common queries
create index if not exists idx_tools_category on public.tools(category);
create index if not exists idx_tools_status on public.tools(status);
create index if not exists idx_tools_featured on public.tools(featured) where featured = true;
create index if not exists idx_tools_slug on public.tools(slug);

-- ─── Submissions ────────────────────────────────────────────────────────────
create table if not exists public.submissions (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references public.accounts(id) on delete set null,
  payload jsonb not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now() not null
);

-- ─── Subscriptions ──────────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references public.accounts(id) on delete cascade not null,
  tool_id uuid references public.tools(id) on delete cascade not null,
  stripe_subscription_id text unique,
  stripe_price_id text,
  tier text not null check (tier in ('basic', 'category', 'featured', 'premium')),
  status text default 'active' check (status in ('active', 'past_due', 'canceled', 'incomplete')),
  current_period_end timestamptz,
  created_at timestamptz default now() not null
);

create index if not exists idx_subscriptions_tool on public.subscriptions(tool_id);
create index if not exists idx_subscriptions_account on public.subscriptions(account_id);
create index if not exists idx_subscriptions_stripe on public.subscriptions(stripe_subscription_id);

-- ─── Auto-update updated_at ─────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_tools_updated
  before update on public.tools
  for each row execute function public.handle_updated_at();

-- ─── Row Level Security ─────────────────────────────────────────────────────

-- Tools: public read for published, owners can edit their own
alter table public.tools enable row level security;

create policy "Public can read published tools"
  on public.tools for select
  using (status = 'published');

create policy "Owners can update own tools"
  on public.tools for update
  using (auth.uid() = account_id);

create policy "Service role full access to tools"
  on public.tools for all
  using (auth.role() = 'service_role');

-- Accounts: users can read/update own
alter table public.accounts enable row level security;

create policy "Users can read own account"
  on public.accounts for select
  using (auth.uid() = id);

create policy "Users can update own account"
  on public.accounts for update
  using (auth.uid() = id);

create policy "Service role full access to accounts"
  on public.accounts for all
  using (auth.role() = 'service_role');

-- Submissions: authenticated users can insert, read own
alter table public.submissions enable row level security;

create policy "Authenticated can insert submissions"
  on public.submissions for insert
  with check (auth.role() = 'authenticated');

create policy "Users can read own submissions"
  on public.submissions for select
  using (auth.uid() = account_id);

create policy "Service role full access to submissions"
  on public.submissions for all
  using (auth.role() = 'service_role');

-- Subscriptions: users can read own
alter table public.subscriptions enable row level security;

create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = account_id);

create policy "Service role full access to subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role');
