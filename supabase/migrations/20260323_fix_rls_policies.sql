-- ============================================================
-- HIVE RLS Policy Fixes — 2026-03-23
-- Run this in Supabase SQL Editor (Settings → SQL Editor)
-- ============================================================

-- ── 1. Fix creators_own_record policy ─────────────────────────
-- BUG: auth.uid()::text = id::text  ← compares auth user UUID to creator row UUID
-- FIX: auth.uid() = auth_user_id    ← compares to the correct FK column

drop policy if exists "creators_own_record" on creators;

create policy "creators_own_record" on creators
  for all using (
    auth.uid() = auth_user_id
    or auth_user_role() = 'admin'
  );

-- ── 2. Fix analytics_snapshots policy ──────────────────────────
-- BUG: restaurant_id = auth_restaurant_id() — analytics_snapshots has no restaurant_id column
-- FIX: join through proof_submissions → orders to reach restaurant_id

drop policy if exists "analytics_restaurant" on analytics_snapshots;

create policy "analytics_restaurant" on analytics_snapshots
  for select using (
    proof_id in (
      select ps.id
      from proof_submissions ps
      join orders o on o.id = ps.order_id
      where o.restaurant_id = auth_restaurant_id()
    )
    or auth_user_role() = 'admin'
  );

-- ── 3. Add missing creator-side policies on orders ─────────────
-- Creators need to read their own orders (cart, history, proof flow)

drop policy if exists "orders_creator_read" on orders;

create policy "orders_creator_read" on orders
  for select using (
    creator_id in (
      select id from creators where auth_user_id = auth.uid()
    )
  );

-- ── 4. Add missing creator-side policies on proof_submissions ──
-- Creators need to read their own proofs and submit new ones

drop policy if exists "proof_submissions_creator_read" on proof_submissions;
drop policy if exists "proof_submissions_creator_insert" on proof_submissions;

create policy "proof_submissions_creator_read" on proof_submissions
  for select using (
    creator_id in (
      select id from creators where auth_user_id = auth.uid()
    )
    or auth_user_role() = 'admin'
  );

create policy "proof_submissions_creator_insert" on proof_submissions
  for insert with check (
    creator_id in (
      select id from creators where auth_user_id = auth.uid()
    )
  );

-- ── 5. Ensure orders write policy exists for creators ──────────
-- Creators need to insert orders (create comp request)

drop policy if exists "orders_creator_insert" on orders;

create policy "orders_creator_insert" on orders
  for insert with check (
    creator_id in (
      select id from creators where auth_user_id = auth.uid()
    )
  );

-- ── 6. Create push_tokens table (iOS/Android push notifications) ──

create table if not exists push_tokens (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('ios', 'android')),
  token text not null,
  updated_at timestamptz not null default now(),
  unique(auth_user_id, platform)
);

alter table push_tokens enable row level security;

create policy "push_tokens_own" on push_tokens
  for all using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());
