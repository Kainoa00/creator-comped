# CreatorComped — How to Use

A complete guide to all three portals of the CreatorComped platform.

---

## Overview

CreatorComped is an invite-only creator network that connects local content creators with partner restaurants. Creators get their meals fully comped in exchange for posting authentic Instagram Reels or TikToks. Monthly leaderboards award cash prizes to top performers.

The platform has three distinct portals:

| Portal | URL | Device | Who Uses It |
|--------|-----|--------|-------------|
| Creator App | `/creator` | Mobile (390px) | Content creators |
| Restaurant Dashboard | `/restaurant` | iPad/Desktop | Restaurant staff & managers |
| Admin Panel | `/admin` | Desktop | Platform administrators |

> **Demo Mode:** All data is simulated. No real transactions occur. You can freely click through every flow without creating real accounts or charges.

---

## 1. Creator App (Mobile)

Navigate to `/creator` to enter the mobile creator experience.

### Discover Page (`/creator/discover`)

The landing view for creators. Shows an interactive Mapbox map of all partner restaurants in Utah County.

- **Map pins** — tap any blue pin to see a restaurant preview card
- **Bottom sheet card** — shows restaurant name, address, cuisine type, comp value, and required deliverable (IG Reel, TikTok, or both)
- **"View Menu" button** — navigates to the restaurant's full menu page
- **Bottom tab bar** — switch between Discover (map) and Profile

### Restaurant Menu Page (`/creator/discover/[restaurantId]`)

Shows a specific restaurant's comped menu.

- **Header** — restaurant name, address, open/closed status, daily hours, countdown to next available comp
- **Required Hashtags** — the exact hashtags you must include in your post
- **Tag in Post** — the restaurant's social handle to tag
- **Required Deliverable badge** — e.g., "1 Instagram Reel required"
- **Menu items** — each item shows a name, description, and a `+` button to add to cart
  - Items have a **Max qty per order** limit shown on hover
  - Items already in cart show a quantity badge
- **Cart icon** (top right) — navigates to your order when items are added

### Cart Page (`/creator/cart`)

Review your order before placing it.

- **Restaurant info card** — confirms which restaurant you're ordering from
- **Deliverable reminder** — colored gradient card reminding you what to post
- **Items list** — adjust quantities with `−` / `+`, remove with the trash icon
- **Before you continue** — three checkboxes you must agree to:
  1. Post within 48 hours of redemption
  2. Keep your account public for 30+ days
  3. Understand 3 strikes = permanent ban
- **Place Order button** — active only when all three boxes are checked; generates your unique QR code and 5-digit redemption code

### Redeem Page (`/creator/redeem`)

Your active comp with the QR code to show restaurant staff.

- **QR Code** — scannable by the restaurant's iPad scanner
- **5-digit code** — fallback if scanner doesn't work
- **Countdown timer** — shows time remaining to use the comp (turns red when < 12 hours)
- **Order summary** — list of all items in your comp
- **Comp value** — total dollar value being comped
- **Expired state** — if the code expires, shows an option to contact support

### Profile Page (`/creator/profile`)

Your creator dashboard showing stats, leaderboard position, and history.

- **Avatar + verified badge** — your profile photo and verification status
- **Social handles** — linked Instagram and TikTok accounts
- **Stats row** — Total Comps, Approved posts, and Avg Score
- **This Month's Standings** — live leaderboard cards for Instagram and TikTok
  - Your entry is highlighted in blue
  - Shows top 3 creators with medal icons (🥇🥈🥉)
  - If not on the leaderboard yet: "Submit an approved post to enter"
- **Comp History** — chronological list of all past comps with status badges:
  - `Confirmed` (blue) — comp placed, waiting for post
  - `Proof Submitted` (amber) — post submitted, pending admin review
  - `Approved` (green) — post approved, points awarded
  - `Rejected` (red) — post rejected (strikes may apply)

---

## 2. Restaurant Dashboard

Navigate to `/restaurant` for the restaurant portal. This is designed for iPad use but works on any screen.

### Staff Scanner (`/restaurant`)

The primary view for front-of-house staff. Used to verify and confirm creator comps.

**Left panel — QR Scanner:**
- **Blue scan area** — in production, activates the device camera to scan creator QR codes
- **5-digit code entry** — manual fallback; auto-submits when all 5 digits are entered
- **Demo codes** — shown below the input for testing: `48291 71688 33947 59012`

**Right panel — Today's Redemptions:**
- Live list of all comps processed today
- Each row shows: creator name, restaurant, items, time, and status
- **Status colors:**
  - Green border — Confirmed
  - Amber border — Proof Submitted
  - Blue border — Approved
  - Red border — Rejected

**How it works section** (bottom of left panel):
1. Creator opens the app and selects items
2. They show you their QR code or 5-digit code
3. You scan or enter the code to confirm
4. The comp is applied — no cash needed

### Manager Dashboard (`/restaurant/manager`)

Protected by a 4-digit PIN. Demo PIN: **1234**

After unlocking, the Manager Dashboard shows:

**Overview stats:**
- Active comps today
- Pending proof submissions
- Total approved posts this month
- Strike rate

**Navigation (left sidebar):**
- **Scanner** — back to staff scanner
- **Manager** — this dashboard

**Sub-pages accessible from the manager sidebar:**

#### Analytics (`/restaurant/manager/analytics`)
- Views by platform (IG vs TikTok)
- Monthly comp volume chart
- Top performing creators
- Average comp value over time

#### History (`/restaurant/manager/history`)
- Full redemption history with filtering by date, status, and creator
- Export-ready table format

#### Menu (`/restaurant/manager/menu`)
- View and manage comped menu items
- Each item shows name, description, max qty, and availability status

#### Settings (`/restaurant/manager/settings`)
- Restaurant profile info
- Notification preferences
- Operating hours

---

## 3. Admin Panel

Navigate to `/admin` for the platform administration interface. This is a full desktop experience.

**Left sidebar navigation:**
- Dashboard
- Creator Vetting (badge shows pending count)
- Proof Review (badge shows pending count)
- Strikes & Bans
- Leaderboard
- Restaurants

### Admin Dashboard (`/admin`)

The command center for platform oversight.

**Stat cards (top row):**
| Stat | Description |
|------|-------------|
| Total Creators | All registered creators |
| Verified | Creators who passed vetting |
| Pending Vetting | Applications awaiting review |
| Active Restaurants | Partner restaurants in the network |
| Comps This Month | Total comps processed this month |
| Proofs Pending | Content proofs awaiting review |

**Pending Proof Review panel** — quick list of the most urgent proof submissions with creator name, restaurant, and a direct `Review` button.

**Pending Vetting panel** — new creator applications waiting for approval, with social handles and submit time.

**Recent Activity feed** — chronological log of all platform events (approvals, rejections, strikes, new restaurants).

**February Leaderboard** — top 3 creators for both Instagram and TikTok, with follower counts and progress bars. Includes a "Lock Contest Snapshot" button to finalize the monthly results.

### Creator Vetting (`/admin/vetting`)

Review creator applications before granting platform access.

- **Creator card** — name, email, Instagram handle, TikTok handle, follower count, submission time
- **Approve button** — grants the creator access, marks them as Verified
- **Reject button** — rejects the application with optional notes
- **DM Verification** — note field to record that you've manually verified via DMs

### Proof Review Queue (`/admin/proof`)

Review content proofs submitted by creators after a comp.

**Filter controls:**
- **Status filters:** All / Pending / Needs Fix / Approved / Rejected
- **Platform filters:** All Platforms / IG Reel / TikTok
- **Search bar** — filter by creator name or restaurant

**Proof row columns:**
- Platform badge (pink for IG Reel, dark for TikTok)
- Creator name + handle
- Restaurant name
- Submitted time
- Deadline with color-coded urgency (amber = < 24h, red = passed)
- Content URL with copy button
- Status badge
- Review button

**Proof detail page (`/admin/proof/[id]`):**
- Full proof information
- Content URL to open and verify
- Required hashtags checklist
- Approve / Request Fix / Reject actions
- Notes field for feedback to creator

### Strikes & Bans (`/admin/strikes`)

Manage creator strikes and ban states.

- View all creators with active strikes
- Issue a new strike with reason (account_private, no_post, late_post, etc.)
- Upgrade to temporary or permanent ban
- Remove a strike if issued in error

### Leaderboard (`/admin/leaderboard`)

Monthly contest management.

- View current month rankings for IG Reel and TikTok separately
- See each creator's score, follower count, and post engagement
- **Lock Snapshot** — freezes the leaderboard at month-end to determine prize winners
- View historical contest results

### Restaurants (`/admin/restaurants`)

Manage the partner restaurant network.

- Add new restaurants
- View/edit restaurant details (name, address, hours, comp budget)
- Activate or deactivate restaurants
- View per-restaurant comp analytics

---

## Demo Flow: Full Creator Journey

To see the complete flow from start to finish:

1. Go to `/creator/discover` → tap a restaurant pin on the map
2. Tap **"View Menu"** → add 1-2 items with the `+` button
3. Tap the cart icon → review your order on `/creator/cart`
4. Check all 3 agreement boxes → tap **"Place Order"**
5. You're taken to `/creator/redeem` with your QR code
6. In a separate tab, go to `/restaurant` and enter one of the demo 5-digit codes
7. The redemption is confirmed in the restaurant's Today's Redemptions panel
8. Go to `/admin/proof` to see how an admin would review submitted content

---

## Technical Notes

- **Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS v4, Supabase (backend), Mapbox (maps)
- **Demo data:** Defined in `lib/demo-data.ts` — all creators, restaurants, orders, and proofs
- **State management:** Zustand stores in `lib/stores/` for cart and order state
- **Design tokens:** CSS custom properties in `app/globals.css` under `@theme inline`
- **Primary color:** `#5c8ebf` (matte blue) — used for all primary actions and accents
- **Font:** Manrope (Google Fonts) — loaded via `next/font` in `app/layout.tsx`

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

Environment variables required for Mapbox (in `.env.local`):
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
```
