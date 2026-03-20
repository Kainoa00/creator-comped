# CreatorComped — In-Depth User Guide

A comprehensive reference for all three portals of the CreatorComped platform.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Business Rules & Logic](#2-business-rules--logic)
3. [Creator App (Mobile)](#3-creator-app-mobile)
   - [Discover Page](#31-discover-page)
   - [Restaurant Menu Page](#32-restaurant-menu-page)
   - [Cart Page](#33-cart-page)
   - [Redeem Page](#34-redeem-page)
   - [Profile Page](#35-profile-page)
4. [Restaurant Dashboard](#4-restaurant-dashboard)
   - [Staff Scanner](#41-staff-scanner)
   - [Manager Dashboard](#42-manager-dashboard)
   - [Analytics](#43-analytics)
   - [History](#44-history)
   - [Menu Management](#45-menu-management)
   - [Settings](#46-settings)
5. [Admin Panel](#5-admin-panel)
   - [Admin Dashboard](#51-admin-dashboard)
   - [Creator Vetting](#52-creator-vetting)
   - [Proof Review Queue](#53-proof-review-queue)
   - [Proof Detail Page](#54-proof-detail-page)
   - [Strikes & Bans](#55-strikes--bans)
   - [Leaderboard](#56-leaderboard)
   - [Restaurants](#57-restaurants)
6. [Full Demo Walkthroughs](#6-full-demo-walkthroughs)
   - [Complete Creator Journey](#61-complete-creator-journey)
   - [Restaurant Staff Verification Flow](#62-restaurant-staff-verification-flow)
   - [Admin Review Workflow](#63-admin-review-workflow)
7. [Scoring & Leaderboard Logic](#7-scoring--leaderboard-logic)
8. [Strikes & Enforcement](#8-strikes--enforcement)
9. [Frequently Asked Questions](#9-frequently-asked-questions)
10. [Troubleshooting](#10-troubleshooting)
11. [Developer Setup](#11-developer-setup)
12. [Customization Guide](#12-customization-guide)

---

## 1. Platform Overview

CreatorComped is an invite-only creator network that connects local content creators with partner restaurants. The exchange is simple:

- **Creators** get their meals fully comped (free) at partner restaurants
- **Restaurants** get authentic Instagram Reels and TikTok videos posted by real creators
- **The platform** manages vetting, verification, enforcement, and monthly cash prize leaderboards

### Three Portals at a Glance

| Portal | URL | Best Device | Who Uses It |
|--------|-----|-------------|-------------|
| Creator App | `/creator` | iPhone (390px wide) | Content creators ordering comps |
| Restaurant Dashboard | `/restaurant` | iPad or Desktop | Front-of-house staff + managers |
| Admin Panel | `/admin` | Desktop | Platform administrators |

### Demo Mode

This deployment runs in full **Demo Mode**. That means:

- All creators, restaurants, orders, and proof submissions are simulated
- No real payments, accounts, or transactions occur
- You can click through every flow freely without side effects
- All data resets if you clear your browser's local storage

---

## 2. Business Rules & Logic

Understanding how the platform works under the hood helps you navigate each portal.

### Comp Eligibility

- Only **verified creators** (those who passed vetting) can place comp orders
- Each creator can have **one active comp at a time** — they must use it before ordering again
- Comp codes expire **20 minutes** after they are generated
- Once used at a restaurant, the code is marked **Confirmed**

### Posting Requirements

After a creator's comp is confirmed at the restaurant, they must:

1. Post the required content within **48 hours**
2. Keep their social account **public** for at least **30 days** after posting
3. Include the restaurant's **required hashtags** in the caption
4. **Tag** the restaurant's official social handle in the post

### Required Deliverable Types

Each restaurant sets one of four deliverable types:

| Type | Requirement |
|------|-------------|
| `IG_REEL` | One Instagram Reel |
| `TIKTOK` | One TikTok Video |
| `CHOICE` | Creator chooses: IG Reel OR TikTok |
| `BOTH` | Creator must post IG Reel AND TikTok |

### Proof Submission

After posting, the creator submits a URL to their post. An admin reviews the proof within 48 hours and either:

- **Approves** — score awarded, creator's rank updated
- **Requests Fix** — creator must resubmit with corrections
- **Rejects** — creator receives a strike

### Comp Value

Each menu item has a dollar value. The total comp value shown to the creator is the sum of all items in their order.

---

## 3. Creator App (Mobile)

Navigate to `/creator` on any device. The experience is designed for **390px mobile width** — best viewed on an iPhone or by setting Chrome DevTools to iPhone 14 Pro.

The creator app has two main sections accessible via the **bottom tab bar**:
- **Discover** (map icon) — browse restaurants
- **Profile** (person icon) — your stats and history

---

### 3.1 Discover Page

**URL:** `/creator/discover`

This is the landing view for creators. It shows an interactive **Mapbox map** of all partner restaurants in Utah County.

#### Map Interaction

1. The map loads centered on Utah County with all partner restaurants visible as **blue pins**
2. Tap any pin to open a **bottom sheet restaurant card**
3. The card shows:
   - Restaurant name and address
   - Cuisine type
   - Total comp value (e.g., "$42 comp")
   - Required deliverable badge (IG Reel / TikTok / Choice / Both)
4. Tap **"View Menu"** on the card to navigate to that restaurant's full menu

#### Navigation Tips

- Pinch to zoom, drag to pan — standard map controls
- If a pin is hard to tap, zoom in first
- The bottom sheet card closes if you tap the map background
- Tapping a different pin switches to that restaurant's card

---

### 3.2 Restaurant Menu Page

**URL:** `/creator/discover/[restaurantId]`

#### Page Sections

**Header Section:**
- Restaurant name (large, bold)
- Full street address
- **Open / Closed** status badge — green for open, red for closed
- Daily operating hours (e.g., "Mon–Fri: 11am–9pm")
- Countdown to next available comp window (if currently closed)

**Social Requirements Section:**
- **Required Hashtags** — a row of pill-shaped hashtag chips you must include verbatim in your post caption. Example: `#CreatorComped` `#UTEats` `#[RestaurantHandle]`
- **Tag in Post** — the restaurant's Instagram and/or TikTok handle you must @ tag

**Required Deliverable Badge:**
- A prominent colored banner showing what type of content is required
- Pink gradient = Instagram Reel required
- Dark gradient = TikTok required
- Blue gradient = Your choice (IG or TikTok)
- Amber/orange gradient = Both platforms required

**Menu Items:**

Each item shows:
- Item name and description
- A `+` button to add to your cart
- **Max qty per order** — visible on hover/tap; this is the maximum of that item you can order in a single comp

Adding items:
1. Tap `+` to add an item — it appears in your cart
2. If an item is already in your cart, the `+` button shows a **quantity badge** (e.g., "2")
3. You cannot exceed the `Max qty per order` for any single item

**Cart Icon (top right):**
- Appears once you have at least one item in cart
- Shows a count badge of total items
- Tapping it navigates to `/creator/cart`

---

### 3.3 Cart Page

**URL:** `/creator/cart`

#### Empty Cart State

If you navigate here with nothing in your cart, you see an empty state with:
- A shopping cart icon
- "Ready to get comped?" heading
- A **Browse Restaurants** button that takes you back to Discover

#### Filled Cart View

**Restaurant Info Card** (top):
- Confirms which restaurant you're ordering from
- Shows the deliverable type icon

**Deliverable Reminder Banner:**
- A gradient card reminding you exactly what you must post
- Failure to comply = strike + potential account block

**Items List:**

For each item:
- Item name on the left
- Quantity controls on the right:
  - `−` button — decreases qty by 1; if qty reaches 0, the item is automatically removed
  - Current quantity shown in the middle
  - `+` button — increases qty (up to max qty limit)
  - Trash icon — removes the item immediately

**Before You Continue — Agreement Checkboxes:**

You must check all three boxes before you can place your order:

1. ☐ **"I agree to post within 48 hours of redemption."**
2. ☐ **"My account will remain public. Posts must stay active for at least 30 days."**
3. ☐ **"I understand 3 strikes = permanent ban from CreatorComped."**

Tap each row to toggle. The checkbox animates from an empty square to a filled blue square with a checkmark.

A helper message below the checkboxes ("Check all boxes above to place your order") disappears once all three are checked.

**Place Order Button (bottom, fixed):**

- Disabled (grayed out) until all 3 checkboxes are checked AND at least 1 item is in the cart
- Shows a spinner animation while processing ("Placing Order...")
- On success: generates a unique QR code and 5-digit redemption code, saves to your active redemption, clears the cart, shows a success toast, and redirects to `/creator/redeem`

---

### 3.4 Redeem Page

**URL:** `/creator/redeem`

This is the most important page for creators — it contains the code to show restaurant staff.

#### Empty State

If you haven't placed an order yet (or your last code expired and was cleared), you see:
- A large QR code icon
- "No active comp" heading
- A **Browse Restaurants** button

#### Active Redemption View

**Header:**
- CreatorComped logo (top left)
- Restaurant name chip with a green active dot (top right)
- Restaurant name title
- Instruction: "Show to Restaurant Staff"
- Sub-text: "Ask them to scan the QR code or enter the 5-digit code"

**QR Code:**
- A large, scannable QR code (220×220px)
- Restaurant name shown below it
- The QR code encodes a unique token that the restaurant's scanner reads

**OR Divider** — separates the QR code from the manual code fallback

**5-Digit Code:**
- Displayed in large mono font (e.g., `48291`)
- Wide letter-spacing for easy reading from a distance
- Grayed out when the code has expired

**Countdown Timer:**
- Shows time remaining in MM:SS format
- Color changes based on urgency:
  - **Green** — more than 24 hours remaining
  - **Amber** — less than 24 hours remaining
  - **Red (pulsing)** — less than 12 hours remaining
  - **Red (static)** — expired

**Items Ordered:**
- Chip pills listing every item in your comp order
- If qty > 1, a small badge shows the quantity

**Warning Banner:**
- "Do not leave this screen until staff confirms your order."
- Important: navigating away doesn't invalidate the code, but you may miss the confirmation window

#### Expired State

When the 20-minute countdown hits zero, a full-screen overlay appears:
- Red alert icon
- "Code Expired" heading
- Explanation text
- **Start Over** button — clears the expired redemption and returns you to Discover so you can place a new order

#### Screen Wake Lock

The Redeem page requests a **Wake Lock** from your device, which prevents the screen from dimming while you're showing the QR code to staff. This works on most modern mobile browsers (Chrome, Edge, Safari 16.4+).

---

### 3.5 Profile Page

**URL:** `/creator/profile`

#### Profile Header

- **Avatar** — your profile photo, shown as a circle
- **Verified badge** — a blue checkmark if you've passed vetting
- **Name** in large font below the avatar
- **Social handles** — Instagram handle (pink) and TikTok handle (dark), each shown as a pill badge

#### Stats Row

Three key metrics displayed in a card:

| Stat | What It Shows |
|------|---------------|
| Total Comps | Total number of comp orders ever placed |
| Approved | Number of posts that were approved by admins |
| Avg Score | Your average contest score across all approved entries |

If you have no approved entries yet, Avg Score shows "—" in a lighter gray color.

#### This Month's Standings

Two leaderboard cards side-by-side (Instagram Reel and TikTok) showing:
- Rank number
- Top 3 creators with medal icons: 🥇 🥈 🥉
- Follower count and score for each creator
- **Your entry is highlighted in blue** if you appear on the leaderboard
- If you haven't submitted an approved post yet: "Submit an approved post to enter"

#### Comp History

A chronological list of all your past and active comps, showing:
- Restaurant name and date
- Items ordered
- Status badge:

| Status | Color | Meaning |
|--------|-------|---------|
| Confirmed | Blue | Comp placed and confirmed at restaurant; waiting for you to post |
| Proof Submitted | Amber | You've submitted your post URL; admin is reviewing |
| Approved | Green | Post approved, points awarded to leaderboard |
| Rejected | Red | Post rejected (you may have received a strike) |

---

## 4. Restaurant Dashboard

Navigate to `/restaurant`. Designed for **iPad or desktop** use. The layout has a persistent **left sidebar** with navigation.

### Sidebar Navigation

- **Scanner** — takes you to the staff scanner (default view)
- **Manager** — takes you to the manager dashboard (PIN protected)

The currently active page is shown with a blue left border accent on the sidebar item.

---

### 4.1 Staff Scanner

**URL:** `/restaurant`

This is the primary daily tool for front-of-house staff.

#### Left Panel — Redemption Input

**QR Scanner (top):**
- A blue-bordered scanning area
- In production, this activates the device camera to scan creator QR codes
- In demo mode, the camera is simulated — use the manual code entry below instead

**5-Digit Code Entry:**
- Five individual digit boxes in a row
- Tap the first box and type (or tap) digits one at a time
- The cursor automatically advances to the next box after each digit
- When all 5 digits are entered, the code is **automatically submitted** (no button press needed)
- If the code is valid, a success confirmation appears
- If invalid, an error message appears and the boxes clear for re-entry

**Demo Codes (for testing):**

These codes are pre-loaded and will always validate successfully:

```
48291   71688   33947   59012
```

Enter any of these codes to simulate a successful redemption confirmation.

**How It Works — Step-by-Step Instructions** (shown at the bottom of the left panel):

1. Creator opens the app and selects items from your menu
2. They show you their QR code or read out the 5-digit code
3. You scan or enter the code
4. Comp is applied — no cash exchanged, no POS entry needed

#### Right Panel — Today's Redemptions

A live list of all comps processed today at this restaurant. Each row shows:

- Creator's name and avatar
- Restaurant name (useful in multi-location context)
- Items ordered (comma-separated)
- Time the comp was confirmed
- Status border color:

| Border Color | Status |
|--------------|--------|
| Green | Confirmed |
| Amber | Proof Submitted (creator has posted) |
| Blue | Approved (admin reviewed and approved) |
| Red | Rejected |

If no redemptions have been processed today, an empty state shows "No redemptions yet today."

---

### 4.2 Manager Dashboard

**URL:** `/restaurant/manager`

**PIN Protected** — requires a 4-digit PIN to access.

Demo PIN: **`1234`**

Enter the PIN on the lock screen. If entered correctly, you're taken directly to the manager dashboard. If wrong, the display shakes and clears for retry.

#### Overview Stats (top cards)

Four key metrics at a glance:

| Stat | Description |
|------|-------------|
| Active Comps Today | Comps confirmed today that haven't expired |
| Pending Proof | Creator posts submitted but not yet admin-reviewed |
| Approved Posts This Month | Total approved posts from your restaurant this month |
| Strike Rate | Percentage of your comps that resulted in a creator strike |

#### Sub-page Navigation

From the manager dashboard sidebar, you can access four additional views. Each is described in sections below.

---

### 4.3 Analytics

**URL:** `/restaurant/manager/analytics`

Visual breakdowns of your restaurant's creator program performance:

**Views by Platform:**
- A bar or pie chart showing the split between Instagram Reel views and TikTok views
- Helps identify which platform drives more reach for your restaurant

**Monthly Comp Volume:**
- A line or bar chart showing how many comps were processed each month
- Shows trends over the trailing 6–12 months

**Top Performing Creators:**
- Ranked list of creators who generated the most engagement at your location
- Shows each creator's handle, follower count, and engagement metrics

**Average Comp Value Over Time:**
- Tracks whether creators are ordering more or less per visit over time

---

### 4.4 History

**URL:** `/restaurant/manager/history`

A complete, filterable redemption history for your restaurant.

**Filter Controls:**

- **Date range** — filter by a specific date or range
- **Status** — All / Confirmed / Proof Submitted / Approved / Rejected
- **Creator name** — search by creator name or handle

**Table Columns:**

| Column | Description |
|--------|-------------|
| Creator | Name and avatar |
| Items | What was ordered |
| Comp Value | Dollar amount comped |
| Date & Time | When the comp was confirmed |
| Post Status | Current status of their content proof |
| Actions | Link to view the creator's proof (if submitted) |

All data can be exported in a table-ready format for accounting or reporting purposes.

---

### 4.5 Menu Management

**URL:** `/restaurant/manager/menu`

View and manage the items available for creators to order as part of their comp.

**Menu Item Card Fields:**

| Field | Description |
|-------|-------------|
| Name | Item name as shown to creators |
| Description | Short description of the dish |
| Max Qty Per Order | Maximum of this item a creator can add in one order |
| Available | Toggle to hide/show the item from creators |
| Comp Value | Dollar value counted toward the creator's total comp |

**Adding a New Item:**
- Click "Add Item" (top right)
- Fill in the form: name, description, max qty, comp value
- Toggle "Available" to make it immediately visible to creators
- Save

**Editing an Item:**
- Click any item row to open the edit panel
- Modify any field and save
- Changes take effect immediately for new orders

**Deactivating an Item:**
- Toggle the "Available" switch to off
- The item becomes hidden from the creator menu but remains in the history for past orders

---

### 4.6 Settings

**URL:** `/restaurant/manager/settings`

**Restaurant Profile:**
- Restaurant name
- Address
- Cuisine type
- Social handles (Instagram, TikTok)
- Cover photo

**Required Deliverable:**
- Choose between IG_REEL, TIKTOK, CHOICE, or BOTH
- Changing this updates what creators see immediately

**Required Hashtags:**
- List of hashtags creators must include in their post captions
- Add or remove hashtags from this list

**Operating Hours:**
- Set open/close times for each day of the week
- Toggle days as open or closed

**Notification Preferences:**
- Email alerts for new redemptions
- Email alerts for approved posts going live
- Daily summary reports

---

## 5. Admin Panel

Navigate to `/admin`. This is a full **desktop experience** designed for platform administrators.

**Left Sidebar Navigation:**
- Dashboard
- Creator Vetting *(badge shows pending count)*
- Proof Review *(badge shows pending count)*
- Strikes & Bans
- Leaderboard
- Restaurants

---

### 5.1 Admin Dashboard

**URL:** `/admin`

The command center for platform oversight.

#### Top Stats Row

| Stat | Description |
|------|-------------|
| Total Creators | All registered creators (verified + unverified) |
| Verified | Creators who passed vetting and are active |
| Pending Vetting | Creator applications awaiting review |
| Active Restaurants | Partner restaurants currently in the network |
| Comps This Month | Total comps processed across all restaurants this month |
| Proofs Pending | Content proofs awaiting admin review |

#### Pending Proof Review Panel

A quick-access list of the most urgent outstanding proof submissions:

- Creator name and avatar
- Restaurant name
- Time since submission
- A **Review** button that deep-links directly to that proof's detail page

Proofs are shown oldest-first (FIFO priority).

#### Pending Vetting Panel

New creator applications waiting for approval:

- Creator name and email
- Instagram handle + follower count
- TikTok handle + follower count
- Time since application was submitted
- Quick **Approve** and **Reject** buttons (same as on the full Vetting page)

#### Recent Activity Feed

A chronological log of all platform events. Each entry shows an icon, description, and timestamp:

- ✅ Creator approved: @handle
- ❌ Creator rejected: @handle
- 🍽️ New comp confirmed at [Restaurant]
- ⚡ Strike issued to @handle
- 🏆 Proof approved for @handle
- 🏪 New restaurant added: [Name]

#### February Leaderboard Panel

Top 3 creators for both Instagram Reel and TikTok, showing:
- Rank, creator name, follower count
- Score with a visual progress bar
- **Lock Contest Snapshot** button — freezes the leaderboard at the end of the month to determine prize winners (see [Leaderboard section](#56-leaderboard))

---

### 5.2 Creator Vetting

**URL:** `/admin/vetting`

New creator applications arrive here after creators submit their info via the sign-up form.

#### Creator Application Card

Each application shows:

| Field | Description |
|-------|-------------|
| Name | Creator's full name |
| Email | Contact email |
| Instagram | @handle + link to verify their account |
| TikTok | @handle + link to verify their account |
| Follower Count | Combined or platform-specific follower count |
| Submitted | How long ago the application was submitted |

#### Review Actions

**Approve:**
1. Verify the creator is real by checking their social profiles (links are clickable)
2. Note in the DM Verification field that you've confirmed via DMs (optional but recommended)
3. Click **Approve** — the creator's status becomes "Verified" and they gain access to place comp orders

**Reject:**
1. Click **Reject**
2. Optionally add a note explaining the reason (not enough followers, fake account, etc.)
3. The creator receives a rejection notification

#### Verification Best Practices

Before approving a creator, check:
- Account is real and active (recent posts, real engagement)
- Follower count meets the platform minimum (typically 1,000+)
- Content style fits the restaurant partnership aesthetic
- Account is currently public

---

### 5.3 Proof Review Queue

**URL:** `/admin/proof`

All creator-submitted content proofs appear here for review. Proofs are shown in FIFO order (oldest first) to ensure creators who submitted first get reviewed first.

#### Quick Stats (header)

Four inline stat pills:

- **X Pending** — proofs not yet reviewed
- **X Needs Fix** — proofs returned to creators for corrections
- **X Approved Today** — proofs approved in the last 24 hours
- **X Rejected Today** — proofs rejected in the last 24 hours

#### Filter Controls

**Status filters** (left button group):
- All / Pending / Needs Fix / Approved / Rejected

**Platform filters** (right button group):
- All Platforms / IG Reel / TikTok

**Search bar** — filter by creator name, restaurant name, or URL

#### Proof Row Columns

| Column | Description |
|--------|-------------|
| Platform badge | Pink pill for IG Reel, dark pill for TikTok |
| Creator | Avatar, name, and social handle |
| Restaurant | Which restaurant the comp was for |
| Submitted | Relative time (e.g., "3h ago") |
| Deadline | Time remaining to review; amber = <24h, red = passed |
| URL | Truncated content URL with copy button |
| Status | Current review status badge |
| Review | Deep-link button to the proof detail page |

**Deadline color coding:**
- No color = plenty of time
- **Amber border** on the row = review deadline is within 24 hours
- **Red border** on the row = review deadline has passed

Click any row (or the Review button) to open the full proof detail page.

---

### 5.4 Proof Detail Page

**URL:** `/admin/proof/[id]`

The full review interface for a single proof submission.

#### Proof Information

- Creator name, avatar, and handle
- Restaurant name
- Platform (IG Reel or TikTok)
- Comp order details (what they ordered, when)
- Date/time submitted
- Review deadline

#### Content URL

- The full URL to the creator's post
- Click to open in a new tab and verify the content directly
- A copy button for quick access

#### Required Hashtags Checklist

A list of every hashtag this restaurant requires, with a checkbox next to each:
- Check each hashtag as you verify it appears in the post caption
- The checklist helps ensure thorough review

#### Review Actions

**Approve:**
- Click **Approve** to mark the proof as accepted
- The creator's score is awarded and their leaderboard rank updates
- Status changes to "Approved" and the creator sees it in their Comp History

**Request Fix:**
- Click **Request Fix** to send the proof back to the creator with notes
- Fill in the **Notes** field explaining what needs to be corrected (e.g., "Missing hashtag #CreatorComped", "Please re-post with restaurant tagged")
- Creator can resubmit after making corrections
- Does **not** issue a strike

**Reject:**
- Click **Reject** if the content violates platform rules or is clearly non-compliant
- Add a note in the **Notes** field explaining the rejection reason
- The creator receives a strike (see [Strikes & Enforcement](#8-strikes--enforcement))
- After 3 strikes, the creator is permanently banned

---

### 5.5 Strikes & Bans

**URL:** `/admin/strikes`

Manage the enforcement side of the platform.

#### Viewing Active Strikes

A list of all creators with one or more active strikes:
- Creator name and handles
- Number of strikes (shown as ⚡ icons)
- Reason for each strike
- Date each strike was issued
- Current ban status (None / Temporary / Permanent)

#### Strike Reasons

When issuing a strike, select from:

| Reason Code | Description |
|-------------|-------------|
| `account_private` | Creator's account was private at time of post |
| `no_post` | No content posted within 48 hours |
| `late_post` | Post was made after the 48-hour window |
| `missing_hashtag` | Required hashtags not included in caption |
| `missing_tag` | Restaurant not tagged in the post |
| `removed_post` | Creator deleted the post within 30 days |
| `wrong_content` | Content doesn't match the required deliverable type |
| `fake_engagement` | Suspected bot or artificial engagement |

#### Issuing a Strike

1. Find the creator in the list (or search by name/handle)
2. Click **Issue Strike**
3. Select the reason code from the dropdown
4. Add optional notes for context
5. Confirm — the strike is added and the creator is notified

#### Strike Escalation

| Strikes | Result |
|---------|--------|
| 1 | Warning + strike on record |
| 2 | Second warning; creator is flagged |
| 3 | Permanent ban from CreatorComped |

**Temporary ban** can be issued manually at admin discretion for serious violations before reaching 3 strikes.

#### Removing a Strike

If a strike was issued in error:
1. Click the strike entry
2. Click **Remove Strike**
3. Add a note explaining the correction
4. Confirm

---

### 5.6 Leaderboard

**URL:** `/admin/leaderboard`

Monthly contest management interface.

#### Current Month Rankings

Two side-by-side leaderboards: **Instagram Reel** and **TikTok**

Each creator entry shows:
- Rank number
- Creator name, avatar, and handle
- Follower count
- Score (calculated from engagement metrics on approved posts)
- A visual score bar showing their standing relative to #1

#### Locking the Contest Snapshot

At the end of each month, click **Lock Snapshot** to:
1. Freeze the current standings permanently
2. Mark the winner for each platform
3. Move the results to the **Historical Results** section below

This action is irreversible. Prize winners should be confirmed before locking.

#### Historical Contest Results

A searchable record of every past month's winners:
- Month and year
- Platform
- Rank 1–3 with creator names and scores
- Prize amounts awarded

---

### 5.7 Restaurants

**URL:** `/admin/restaurants`

Manage the network of partner restaurants.

#### Restaurant List

Each restaurant entry shows:
- Restaurant name and logo
- Address and city
- Active/Inactive status toggle
- Comp budget (monthly dollar limit for comps)
- Number of comps this month vs. budget
- Quick link to that restaurant's analytics

#### Adding a New Restaurant

Click **Add Restaurant** and fill in:
- Restaurant name
- Address
- Cuisine type
- Social handles (Instagram, TikTok)
- Monthly comp budget
- Required deliverable type (IG_REEL / TIKTOK / CHOICE / BOTH)
- Required hashtags list
- Operating hours
- Comped menu items

**After saving**, the restaurant immediately appears on the Discover map for creators.

#### Editing a Restaurant

Click any restaurant to open its edit panel. All fields are editable. Deactivating a restaurant hides it from the creator map without deleting any historical data.

#### Per-Restaurant Analytics

From the restaurant list, click **View Analytics** on any entry to see:
- Total comps all-time
- Average comp value
- Most ordered menu items
- Top creators by post performance
- Monthly trend charts

---

## 6. Full Demo Walkthroughs

### 6.1 Complete Creator Journey

**Time needed: ~5 minutes**

This flow takes you from discovering a restaurant to having your order confirmed.

**Step 1 — Discover a Restaurant**
1. Navigate to `http://localhost:3000/creator/discover` (or your Vercel URL + `/creator/discover`)
2. The Mapbox map loads with blue pins across Utah County
3. Tap any blue pin (e.g., the one near Provo Center Street)
4. A bottom sheet slides up showing the restaurant card
5. Note the comp value (e.g., "$42 comp") and required deliverable (e.g., "IG Reel")
6. Tap **"View Menu"**

**Step 2 — Browse the Menu and Add Items**
1. You're now on the restaurant menu page
2. Review the required hashtags and social handle to tag
3. Scroll to the menu items section
4. Tap `+` on any item — a cart icon appears in the top right with a count badge
5. Add 1-3 more items (try items with max qty > 1 and add 2 of them)
6. Notice the `+` button on items already in your cart shows a quantity badge
7. Tap the cart icon (top right)

**Step 3 — Review and Confirm Your Cart**
1. You're on the Cart page
2. See the restaurant name and deliverable reminder banner
3. Try reducing a quantity with `−` — tap it down to 0 and watch the item auto-remove
4. Add the item back, then check all three agreement checkboxes
5. Watch the "Place Order" button activate (blue, not grayed out)
6. Tap **Place Order**
7. A brief spinner plays, then you're redirected to the Redeem page with a toast notification

**Step 4 — Show Your Redemption Code**
1. You're now on `/creator/redeem`
2. See your QR code and 5-digit code (e.g., `48291`)
3. Notice the countdown timer — 20 minutes, green
4. Keep this screen visible (do NOT navigate away)
5. Note the items listed below the timer

**Step 5 — Verify at the Restaurant**
1. Open a **new browser tab**
2. Navigate to `/restaurant`
3. Look at the demo codes shown under the 5-digit entry: `48291 71688 33947 59012`
4. Enter `48291` (or whichever code was on your creator Redeem screen) digit by digit
5. After the 5th digit, it auto-submits
6. A success confirmation appears
7. Check the **Today's Redemptions** panel on the right — your creator name and items appear

**Step 6 — Check Admin View**
1. Open another tab and navigate to `/admin/proof`
2. See the pending proof submissions from demo creators
3. Click **Review** on any pending proof
4. Walk through the approval flow: check hashtags, open the URL, click **Approve**

---

### 6.2 Restaurant Staff Verification Flow

**Time needed: ~2 minutes**

**Step 1 — Access the Staff Scanner**
1. Navigate to `/restaurant`
2. You see the QR scan area on the left and Today's Redemptions on the right

**Step 2 — Try QR Code Scanning**
1. Look at the blue QR scanning area
2. In demo mode, the camera is simulated
3. Use the 5-digit fallback instead (see below)

**Step 3 — Enter a 5-Digit Code**
1. Click the first digit box under "Or enter 5-digit code"
2. Type `4`, `8`, `2`, `9`, `1` — each digit moves to the next box automatically
3. After the 5th digit, the code auto-submits
4. See the success confirmation: creator name, items, and total comp value appear
5. The entry appears in **Today's Redemptions** on the right with a green "Confirmed" border

**Step 4 — Access Manager View**
1. Click **Manager** in the left sidebar
2. Enter PIN: `1234`
3. You now see the manager dashboard with overview stats
4. Click **Analytics** in the sub-navigation to see charts
5. Click **History** to see all past redemptions
6. Click **Menu** to see and manage comped menu items

---

### 6.3 Admin Review Workflow

**Time needed: ~3 minutes**

**Step 1 — Check the Dashboard**
1. Navigate to `/admin`
2. Review the top stat cards — note "Proofs Pending" count
3. See the Pending Proof Review panel and click **Review** on any proof
4. Alternatively, navigate directly to `/admin/proof`

**Step 2 — Filter the Queue**
1. On `/admin/proof`, the queue shows all proofs FIFO
2. Try the status filter: click **Pending** to see only unreviewed proofs
3. Try the platform filter: click **IG Reel** to see only Instagram proofs
4. Try the search bar: type a creator name (e.g., "Mia")

**Step 3 — Review a Proof**
1. Click any proof row or the **Review** button
2. You're on the proof detail page
3. Click the content URL to open the post in a new tab (it's a demo URL, it won't load)
4. Check the required hashtags checklist
5. Click **Approve** → status changes to "Approved"
6. Go back (browser back button) and see the proof is now marked Approved in the queue

**Step 4 — Try Request Fix**
1. Click another proof (one with "Pending" status)
2. In the Notes field, type: "Missing #CreatorComped hashtag in caption. Please repost with all required hashtags."
3. Click **Request Fix**
4. Status changes to "Needs Fix"
5. The creator would be notified to resubmit

**Step 5 — Vetting a New Creator**
1. Navigate to `/admin/vetting`
2. See the pending creator applications
3. Click the Instagram handle link to "verify" the creator (opens their profile)
4. Click **Approve** to grant access
5. The creator's badge changes from "Pending" to "Verified"

---

## 7. Scoring & Leaderboard Logic

The monthly leaderboard ranks creators by their **contest score** on approved posts.

### Score Calculation

Score is not directly exposed in the UI but is computed from:

- **View count** on the post
- **Like count**
- **Comment count**
- **Share/save count**
- **Follower count** of the creator at time of posting (acts as a weight)

Higher engagement relative to follower count rewards creators who generate proportionally strong performance, not just those with large followings.

### Separate Leaderboards

Instagram Reel and TikTok scores are tracked **independently**. A creator who posts both platforms (for restaurants requiring `BOTH`) earns scores on both leaderboards separately.

### Monthly Reset

At the start of each month:
- All active scores reset to 0
- The previous month's snapshot is preserved in Historical Results
- Creators start fresh competing for the new month's prizes

### Tiebreaker

If two creators have the same score:
- The creator with more total approved posts that month ranks higher
- If still tied, the earlier approval timestamp wins

---

## 8. Strikes & Enforcement

### The 3-Strike System

| Status | Description |
|--------|-------------|
| 0 strikes | Good standing |
| 1 strike | Warning on record |
| 2 strikes | At-risk status; creator is flagged for monitoring |
| 3 strikes | Permanent ban — creator cannot place any new orders |

### What Triggers a Strike

- Failing to post within 48 hours of comp confirmation
- Making your account private before the 30-day holding period ends
- Deleting the required post within 30 days
- Missing required hashtags or restaurant tag (only on a Reject decision, not a Request Fix)
- Using a comp code and not showing up to the restaurant
- Submitting a fraudulent or fake proof URL

### What Does NOT Trigger a Strike

- Admin sends a "Request Fix" → creator resubmits correctly → Approved: **no strike**
- Technical issues with the platform (grace periods apply)
- Restaurant was closed unexpectedly after an order was placed

### Appeals

Creators who believe a strike was issued in error should contact platform support. Admins can remove a strike from the Strikes & Bans page if warranted.

---

## 9. Frequently Asked Questions

**Q: Can a creator have more than one active comp at a time?**
No. A creator must use (or let expire) their current active comp before placing a new order.

**Q: What happens if the creator's code expires before staff scans it?**
The code becomes invalid. The creator must start over — go back to the cart, re-add items, and generate a new code. Expired codes do not count as a strike.

**Q: Can a creator use the same restaurant twice in a row?**
The platform can be configured with a per-restaurant cooldown (e.g., must try a different restaurant before returning). In the current demo, no cooldown is enforced.

**Q: What if a restaurant is out of a menu item?**
Restaurant staff should inform the creator and manually swap the item. The system doesn't track real-time inventory.

**Q: How does the admin know the proof URL is real?**
Admins are expected to click the URL and verify the content manually. The platform does not auto-scrape social media. This manual review step ensures quality control.

**Q: Can a creator submit proof after the 48-hour deadline?**
Late submissions can be accepted at admin discretion. The proof detail page flags the deadline status. A late post that is still good content may receive a "Request Fix" rather than a Reject.

**Q: What platforms are supported?**
Currently: Instagram Reels and TikTok videos. Stories, static posts, and YouTube Shorts are not eligible.

**Q: How are prize amounts determined?**
The platform admin sets prize amounts for each monthly contest. Prize tiers (1st, 2nd, 3rd place) are visible on the Leaderboard page once the snapshot is locked.

**Q: Can a restaurant see which specific creators are on the leaderboard?**
Restaurants can see their top performing creators in their Manager Analytics view. The global leaderboard is managed by the admin panel.

**Q: Is there a minimum follower count to join?**
Yes — the current threshold is 1,000 followers on at least one platform. This is enforced during the manual vetting process.

---

## 10. Troubleshooting

### Creator App Issues

**Map doesn't load / shows a blank screen**
- The Mapbox token may be missing or expired
- Check that `NEXT_PUBLIC_MAPBOX_TOKEN` is set in `.env.local`
- Reload the page

**"No active comp" showing even after placing an order**
- Cart state is stored in browser local storage via Zustand
- Try refreshing the page — the order state should persist
- If it doesn't appear, the local storage may have been cleared; place a new order

**Countdown timer not showing**
- This can happen if the browser tab was in the background for a long time
- Refresh the page — the timer picks up from the current time

**QR code shows as EXPIRED immediately**
- The `getCodeExpiry()` function sets a 20-minute window from order placement
- If you placed the order, navigated away, and came back much later, it may have genuinely expired
- Clear the redemption and start a new order

### Restaurant Dashboard Issues

**Manager PIN not working**
- Demo PIN is exactly `1234` — four digits, no letters
- Make sure you're on `/restaurant/manager` (not a sub-page)
- Clear the input and try again

**Today's Redemptions panel is empty**
- No codes have been entered in this browser session
- Try entering demo code `48291` in the scanner to populate a test entry

**Scanner area is gray / camera doesn't activate**
- Camera scanning requires HTTPS in production
- In local development, use the 5-digit code fallback instead

### Admin Panel Issues

**Stats show 0 across all cards**
- Demo data is loaded from `lib/demo-data.ts` — it should always be populated
- Hard-refresh the page (Ctrl+Shift+R / Cmd+Shift+R)

**Proof queue is empty**
- Check that your status filter isn't set to a specific status with no matching proofs
- Click "All" in the status filter to reset

**Can't navigate to `/admin/proof/[id]`**
- Make sure the proof ID in the URL matches one from `DEMO_PROOF_SUBMISSIONS` in `lib/demo-data.ts`
- Use the Review buttons from the queue rather than manually typing URLs

### Build & Dev Issues

**`npm run dev` fails**
- Run `npm install` first if you haven't already
- Check for Node.js version compatibility (requires Node 18+)
- If on Windows with OneDrive sync: run `rm -rf .next` then `npm run dev` again

**TypeScript errors on `npx tsc --noEmit`**
- Run the type check and read the output carefully
- Most common: missing types for demo data extensions — add type assertions where needed

**Tailwind classes not generating CSS**
- This is a known v4 issue with certain utility classes at wide viewports
- Use the `.cc-container` and `.cc-inner` plain CSS classes (defined in `globals.css`) instead of `max-w-*xl mx-auto`

---

## 11. Developer Setup

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher
- A **Mapbox** account and public access token

### Clone and Install

```bash
git clone https://github.com/Kainoa00/creator-comped
cd creator-comped/webapp
npm install
```

### Environment Variables

Create a file called `.env.local` in the `webapp/` directory:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token_here
```

Get your token at https://account.mapbox.com → Tokens → Create a token with `styles:read` and `tiles:read` scopes.

### Run Development Server

```bash
npm run dev
# → http://localhost:3000
```

The three portals are at:
- `http://localhost:3000/` — Landing page
- `http://localhost:3000/creator/discover` — Creator app
- `http://localhost:3000/restaurant` — Restaurant dashboard
- `http://localhost:3000/admin` — Admin panel

### Build for Production

```bash
npm run build
npm start
```

### Type Check

```bash
npx tsc --noEmit
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Follow the prompts to link to your Vercel account. Add `NEXT_PUBLIC_MAPBOX_TOKEN` as an environment variable in the Vercel project settings.

---

## 12. Customization Guide

### Adding a New Restaurant

1. Open `lib/demo-data.ts`
2. Add a new entry to the `DEMO_RESTAURANTS` array:

```typescript
{
  id: 'restaurant-XXX',
  name: 'Your Restaurant Name',
  address: '123 Main St, Provo, UT 84601',
  cuisine_type: 'Italian',
  lat: 40.2338,
  lng: -111.6585,
  ig_handle: '@yourhandle',
  tiktok_handle: '@yourhandle',
  required_hashtags: ['#CreatorComped', '#UTEats', '#YourRestaurant'],
  deliverable_req: {
    id: 'deliv-XXX',
    restaurant_id: 'restaurant-XXX',
    allowed_types: 'IG_REEL',
    min_count: 1,
  },
  is_active: true,
  comp_budget_monthly: 500,
  operating_hours: {
    mon: { open: '11:00', close: '21:00' },
    tue: { open: '11:00', close: '21:00' },
    wed: { open: '11:00', close: '21:00' },
    thu: { open: '11:00', close: '21:00' },
    fri: { open: '11:00', close: '22:00' },
    sat: { open: '10:00', close: '22:00' },
    sun: { open: '10:00', close: '20:00' },
  },
}
```

3. Add menu items to `DEMO_MENU_ITEMS` referencing the new `restaurant_id`
4. The restaurant will appear on the map immediately (development server auto-reloads)

### Changing the Primary Color

The matte blue primary color (`#5c8ebf`) is defined in `app/globals.css`:

```css
@theme inline {
  --color-cc-accent: #5c8ebf;
  --color-cc-accent-dark: #4a7aad;
  --color-cc-accent-subtle: #eaf1f8;
}
```

Change `--color-cc-accent` to any hex value and all buttons, badges, and accents update automatically.

### Changing the Font

The Manrope font is loaded in `app/layout.tsx`:

```typescript
import { Manrope } from 'next/font/google'
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
```

Replace `Manrope` with any other Google Font. Update the `variable` name and apply it in your CSS if the variable name changes.

### Adjusting Comp Code Expiry

The 20-minute expiry is set in `lib/utils.ts`:

```typescript
export function getCodeExpiry(): string {
  const expiry = new Date(Date.now() + 20 * 60 * 1000) // 20 minutes
  return expiry.toISOString()
}
```

Change `20 * 60 * 1000` to your desired duration in milliseconds. For example, `60 * 60 * 1000` = 1 hour.

### Adding a New Admin Page

1. Create a new folder under `app/admin/your-page/`
2. Add a `page.tsx` file following the same pattern as existing admin pages
3. Add the route to the sidebar in `app/admin/layout.tsx`

---

*CreatorComped — Built with Next.js 14, Tailwind CSS v4, Zustand, Mapbox, and Supabase.*
