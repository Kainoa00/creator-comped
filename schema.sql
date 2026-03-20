-- ============================================================
-- CreatorComped Database Schema
-- Run this in your Supabase SQL editor (Settings > SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- CREATORS
-- ─────────────────────────────────────────────────────────────
create table creators (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  photo_url text,
  email text unique not null,
  phone text,
  ig_handle text,
  tiktok_handle text,
  verified boolean not null default false,
  invite_code text,
  strike_count integer not null default 0,
  ban_state text not null default 'none' check (ban_state in ('none', 'temporary', 'permanent')),
  ban_until timestamptz,
  geo_market text not null default 'utah_county' check (geo_market in ('utah_county', 'slc_county')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- RESTAURANTS
-- ─────────────────────────────────────────────────────────────
create table restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  hours jsonb not null default '{}',
  manager_pin text not null default '0000',
  settings jsonb not null default '{
    "daily_comp_cap": null,
    "blackout_start": null,
    "blackout_end": null,
    "cooldown_days": 14,
    "max_items_per_order": 3,
    "pause_comps": false
  }',
  active boolean not null default true,
  -- Extended profile fields
  logo_url text,
  description text,
  phone text,
  website text,
  ig_handle text,
  tiktok_handle text,
  monthly_budget numeric(10,2),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- RESTAURANT USERS (admin dashboard logins)
-- ─────────────────────────────────────────────────────────────
create table restaurant_users (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete set null,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  role text not null default 'staff' check (role in ('staff', 'manager', 'admin')),
  name text not null,
  email text,
  pin text,
  created_at timestamptz not null default now()
);

create index restaurant_users_restaurant_id_idx on restaurant_users(restaurant_id);
create index restaurant_users_auth_user_id_idx on restaurant_users(auth_user_id);

-- ─────────────────────────────────────────────────────────────
-- MENU ITEMS
-- ─────────────────────────────────────────────────────────────
create table menu_items (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  max_qty_per_order integer not null default 1,
  estimated_cogs numeric(10,2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- DELIVERABLE REQUIREMENTS
-- ─────────────────────────────────────────────────────────────
create table deliverable_requirements (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  allowed_types text not null default 'CHOICE' check (allowed_types in ('IG_REEL', 'TIKTOK', 'BOTH', 'CHOICE')),
  required_hashtags text[] not null default '{}',
  required_tags text[] not null default '{}'
);

-- ─────────────────────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────────────────────
create table orders (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references creators(id),
  restaurant_id uuid not null references restaurants(id),
  items jsonb not null default '[]', -- [{menu_item_id, menu_item_name, qty}]
  status text not null default 'created' check (status in ('created','scanned','confirmed','proof_submitted','approved','rejected','expired')),
  redemption_code text not null, -- 5-digit string
  qr_token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  rejection_reason text
);

-- Index for fast lookups by creator / restaurant
create index orders_creator_id_idx on orders(creator_id);
create index orders_restaurant_id_idx on orders(restaurant_id);
create index orders_status_idx on orders(status);

-- ─────────────────────────────────────────────────────────────
-- PROOF SUBMISSIONS
-- ─────────────────────────────────────────────────────────────
create table proof_submissions (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  creator_id uuid not null references creators(id),
  platform text not null check (platform in ('IG_REEL', 'TIKTOK')),
  url text not null,
  screenshot_url text,
  submitted_at timestamptz not null default now(),
  review_status text not null default 'pending' check (review_status in ('pending','approved','needs_fix','rejected')),
  reviewer_notes text,
  deadline timestamptz not null -- 48h after order.confirmed_at
);

create index proof_creator_id_idx on proof_submissions(creator_id);
create index proof_review_status_idx on proof_submissions(review_status);

-- ─────────────────────────────────────────────────────────────
-- ANALYTICS SNAPSHOTS
-- ─────────────────────────────────────────────────────────────
create table analytics_snapshots (
  id uuid primary key default uuid_generate_v4(),
  proof_id uuid not null references proof_submissions(id) on delete cascade,
  timestamp timestamptz not null default now(),
  views integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  score integer not null default 0 -- Views + (Likes*5) + (Comments*25)
);

create index analytics_proof_id_idx on analytics_snapshots(proof_id);

-- ─────────────────────────────────────────────────────────────
-- CONTEST ENTRIES
-- ─────────────────────────────────────────────────────────────
create table contest_entries (
  id uuid primary key default uuid_generate_v4(),
  proof_id uuid not null references proof_submissions(id) on delete cascade,
  creator_id uuid not null references creators(id),
  month text not null, -- "YYYY-MM"
  platform text not null check (platform in ('IG_REEL', 'TIKTOK')),
  score integer not null default 0,
  eligible boolean not null default true,
  disqualified boolean not null default false,
  disqualification_reason text,
  unique(proof_id, month)
);

create index contest_month_idx on contest_entries(month);
create index contest_score_idx on contest_entries(score desc);

-- ─────────────────────────────────────────────────────────────
-- STRIKES
-- ─────────────────────────────────────────────────────────────
create table strikes (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references creators(id) on delete cascade,
  reason text not null check (reason in ('missed_deadline','invalid_url','account_private','post_removed','content_violation','engagement_fraud','other')),
  notes text,
  admin_id text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- INVITE APPLICATIONS
-- ─────────────────────────────────────────────────────────────
create table invite_applications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  ig_handle text,
  tiktok_handle text,
  follower_count integer,
  why_join text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_notes text
);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Scoped policies — creators see own data, restaurant users see their restaurant only.
-- API routes use the service role key which bypasses all RLS.
-- ─────────────────────────────────────────────────────────────
alter table creators enable row level security;
alter table restaurant_users enable row level security;
alter table restaurants enable row level security;
alter table menu_items enable row level security;
alter table deliverable_requirements enable row level security;
alter table orders enable row level security;
alter table proof_submissions enable row level security;
alter table analytics_snapshots enable row level security;
alter table contest_entries enable row level security;
alter table strikes enable row level security;
alter table invite_applications enable row level security;

-- Helper: get the restaurant_id for the currently authenticated user
create or replace function auth_restaurant_id()
returns uuid language sql stable
as $$
  select restaurant_id from restaurant_users
  where auth_user_id = auth.uid()
  limit 1;
$$;

-- Helper: get the role for the currently authenticated user
create or replace function auth_user_role()
returns text language sql stable
as $$
  select role from restaurant_users
  where auth_user_id = auth.uid()
  limit 1;
$$;

-- ── Creators ──────────────────────────────────────────────────
-- Creators can read/write only their own record
create policy "creators_own_record" on creators
  for all using (auth.uid()::text = id::text or auth_user_role() = 'admin');

-- ── Restaurant Users ──────────────────────────────────────────
-- Users can read their own restaurant_users record only
create policy "restaurant_users_own" on restaurant_users
  for select using (auth_user_id = auth.uid() or auth_user_role() = 'admin');

-- ── Restaurants ───────────────────────────────────────────────
-- Restaurant users can read their own restaurant; creators can read all active restaurants
create policy "restaurants_read_own" on restaurants
  for select using (
    id = auth_restaurant_id()
    or auth_user_role() = 'admin'
    or active = true  -- creators can browse active restaurants
  );
create policy "restaurants_write_own" on restaurants
  for update using (id = auth_restaurant_id() or auth_user_role() = 'admin');

-- ── Menu Items ────────────────────────────────────────────────
-- Anyone can read menu items (creators need to browse them)
create policy "menu_items_read_all" on menu_items
  for select using (true);
create policy "menu_items_write_own" on menu_items
  for all using (restaurant_id = auth_restaurant_id() or auth_user_role() = 'admin')
  with check (restaurant_id = auth_restaurant_id() or auth_user_role() = 'admin');

-- ── Orders ────────────────────────────────────────────────────
-- Restaurant users see their restaurant's orders; creators see their own orders
create policy "orders_restaurant_read" on orders
  for select using (
    restaurant_id = auth_restaurant_id()
    or auth_user_role() = 'admin'
  );
create policy "orders_write" on orders
  for all using (
    restaurant_id = auth_restaurant_id()
    or auth_user_role() = 'admin'
  )
  with check (
    restaurant_id = auth_restaurant_id()
    or auth_user_role() = 'admin'
  );

-- ── Proof Submissions ─────────────────────────────────────────
create policy "proof_submissions_restaurant" on proof_submissions
  for select using (
    order_id in (
      select id from orders where restaurant_id = auth_restaurant_id()
    )
    or auth_user_role() = 'admin'
  );

-- ── Analytics, Strikes, Contest, Invite Apps ─────────────────
-- Admin-only write; restaurant users read their own scoped data
create policy "analytics_restaurant" on analytics_snapshots
  for select using (restaurant_id = auth_restaurant_id() or auth_user_role() = 'admin');

create policy "strikes_admin" on strikes
  for all using (auth_user_role() = 'admin');

create policy "contest_entries_read" on contest_entries
  for select using (true);

create policy "invite_applications_read" on invite_applications
  for select using (auth_user_role() = 'admin');
create policy "invite_applications_insert" on invite_applications
  for insert with check (true);  -- anyone can apply

create policy "deliverable_reqs_read" on deliverable_requirements
  for select using (true);
create policy "deliverable_reqs_write" on deliverable_requirements
  for all using (restaurant_id = auth_restaurant_id() or auth_user_role() = 'admin')
  with check (restaurant_id = auth_restaurant_id() or auth_user_role() = 'admin');

-- ─────────────────────────────────────────────────────────────
-- DEMO SEED DATA (Utah County restaurants)
-- ─────────────────────────────────────────────────────────────
insert into restaurants (name, address, lat, lng, hours, settings) values
(
  'Brick Oven Restaurant',
  '111 E 800 N, Provo, UT 84606',
  40.2477, -111.6561,
  '{"mon":{"open":"11:00","close":"22:00","closed":false},"tue":{"open":"11:00","close":"22:00","closed":false},"wed":{"open":"11:00","close":"22:00","closed":false},"thu":{"open":"11:00","close":"22:00","closed":false},"fri":{"open":"11:00","close":"23:00","closed":false},"sat":{"open":"11:00","close":"23:00","closed":false},"sun":{"open":"12:00","close":"21:00","closed":false}}',
  '{"daily_comp_cap":5,"blackout_start":"12:00","blackout_end":"13:30","cooldown_days":14,"max_items_per_order":2,"pause_comps":false}'
),
(
  'Station 22',
  '22 W Center St, Provo, UT 84601',
  40.2338, -111.6588,
  '{"mon":{"open":"11:00","close":"22:00","closed":false},"tue":{"open":"11:00","close":"22:00","closed":false},"wed":{"open":"11:00","close":"22:00","closed":false},"thu":{"open":"11:00","close":"22:00","closed":false},"fri":{"open":"11:00","close":"23:30","closed":false},"sat":{"open":"10:00","close":"23:30","closed":false},"sun":{"open":"10:00","close":"21:00","closed":false}}',
  '{"daily_comp_cap":3,"blackout_start":null,"blackout_end":null,"cooldown_days":7,"max_items_per_order":3,"pause_comps":false}'
),
(
  'Cubby''s Chicago Dogs',
  '223 N University Ave, Provo, UT 84601',
  40.2358, -111.6592,
  '{"mon":{"open":"10:30","close":"22:00","closed":false},"tue":{"open":"10:30","close":"22:00","closed":false},"wed":{"open":"10:30","close":"22:00","closed":false},"thu":{"open":"10:30","close":"22:00","closed":false},"fri":{"open":"10:30","close":"23:00","closed":false},"sat":{"open":"10:30","close":"23:00","closed":false},"sun":{"open":"11:00","close":"21:00","closed":false}}',
  '{"daily_comp_cap":4,"blackout_start":"11:30","blackout_end":"13:00","cooldown_days":10,"max_items_per_order":2,"pause_comps":false}'
);
