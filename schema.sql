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
  created_at timestamptz not null default now()
);

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
-- Permissive for prototype — lock down for production
-- ─────────────────────────────────────────────────────────────
alter table creators enable row level security;
alter table restaurants enable row level security;
alter table menu_items enable row level security;
alter table deliverable_requirements enable row level security;
alter table orders enable row level security;
alter table proof_submissions enable row level security;
alter table analytics_snapshots enable row level security;
alter table contest_entries enable row level security;
alter table strikes enable row level security;
alter table invite_applications enable row level security;

-- Permissive policies (prototype only)
create policy "allow_all_creators" on creators for all using (true) with check (true);
create policy "allow_all_restaurants" on restaurants for all using (true) with check (true);
create policy "allow_all_menu_items" on menu_items for all using (true) with check (true);
create policy "allow_all_deliverable_reqs" on deliverable_requirements for all using (true) with check (true);
create policy "allow_all_orders" on orders for all using (true) with check (true);
create policy "allow_all_proof_submissions" on proof_submissions for all using (true) with check (true);
create policy "allow_all_analytics_snapshots" on analytics_snapshots for all using (true) with check (true);
create policy "allow_all_contest_entries" on contest_entries for all using (true) with check (true);
create policy "allow_all_strikes" on strikes for all using (true) with check (true);
create policy "allow_all_invite_applications" on invite_applications for all using (true) with check (true);

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
