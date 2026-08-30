-- ============================================================
-- Nex0 — Initial database structure
-- Users & Vaults with Row Level Security (RLS)
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- ------------------------------------------------------------
-- Extensions
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Enums
-- ------------------------------------------------------------
create type public.plan_tier as enum (
  'free',
  'starter',
  'pro',
  'enterprise'
);

create type public.payment_status as enum (
  'pending',
  'paid',
  'failed',
  'refunded'
);

create type public.oauth_provider_name as enum (
  'github',
  'google',
  'gitlab'
);

-- ------------------------------------------------------------
-- Users
-- Mirrors src/types/user.ts (Users)
-- ------------------------------------------------------------
create table public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique
    check (char_length(username) between 3 and 32
      and username ~ '^[a-zA-Z0-9_]+$'),
  email text not null unique
    check (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  password text not null, -- bcrypt hash, never exposed to clients
  api_keys jsonb not null default '[]'::jsonb,
  payments jsonb not null default '[]'::jsonb,
  plan public.plan_tier not null default 'free',
  oauth_providers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  signed_at timestamptz
);

-- ------------------------------------------------------------
-- Vaults
-- Normalized out of Users.vaults for querying & sharing
-- ------------------------------------------------------------
create table public.vaults (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null
    check (char_length(name) between 1 and 100),
  description text,
  created_at timestamptz not null default now()
);

create index vaults_user_id_idx on public.vaults (user_id);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.users enable row level security;
alter table public.vaults enable row level security;

-- Helper: the authenticated Supabase user (sub of the JWT)
create or replace function public.current_user_id()
returns uuid
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'sub', '')::uuid;
$$;

-- Users policies
create policy "users_select_own"
  on public.users
  for select
  using (id = public.current_user_id());

create policy "users_update_own"
  on public.users
  for update
  using (id = public.current_user_id())
  with check (id = public.current_user_id());

create policy "users_insert_self"
  on public.users
  for insert
  with check (id = public.current_user_id());

-- Note: no delete policy — account deletion should go through
-- a service-role (admin) endpoint.

-- Vaults policies
create policy "vaults_select_own"
  on public.vaults
  for select
  using (user_id = public.current_user_id());

create policy "vaults_insert_own"
  on public.vaults
  for insert
  with check (user_id = public.current_user_id());

create policy "vaults_update_own"
  on public.vaults
  for update
  using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

create policy "vaults_delete_own"
  on public.vaults
  for delete
  using (user_id = public.current_user_id());

-- ------------------------------------------------------------
-- Notes
-- ------------------------------------------------------------
-- 1. The API routes use SUPABASE_KEY (service role), which
--    bypasses RLS. These policies protect direct client access
--    with an anon/authenticated key.
--
-- 2. The auth API signs its own JWTs. If you want RLS policies
--    above to work for those tokens, the JWT payload must include
--    "sub" = users.id and be verifiable by Supabase (see
--    Supabase custom JWT / third-party auth docs).
--
-- 3. users.password stores a bcrypt hash. Never select it into
--    client responses (the API already strips it).
