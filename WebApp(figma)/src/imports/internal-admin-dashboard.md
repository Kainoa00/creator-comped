Design an INTERNAL ADMIN DASHBOARD web app for Liaison Technologies / Creator Comped (desktop SaaS). Dark premium theme (near-black), clean like Stripe/Shopify admin. Minimal Liaison gradient accents (only for primary CTAs, no glow). Desktop frame 1440px wide.

GOAL
Internal staff (me) can:
- Review/approve/reject Applications (Creators + Restaurants)
- Review/approve/reject Video/Post submissions (deliverables compliance)
- Respond to “Contact us” submissions (Support inbox)
- Browse/search ALL creators and ALL restaurants
- Open any creator/restaurant profile to see full details + analytics

GLOBAL LAYOUT
- Left sidebar navigation (fixed)
- Main content area with:
  - Top header (page title + global search)
  - Two-panel workspace: left table/list + right detail panel
- Use consistent cards, 16–20px spacing, rounded corners 14–18px (slightly sharper than mobile), subtle dividers.

LEFT SIDEBAR (fixed)
- Logo: “Liaison Admin”
- Nav items (with icons):
  1) Applications
  2) Submissions
  3) Support
  Divider
  4) Creators
  5) Restaurants
  Divider
  6) Settings (optional)
- Show small numeric badges on queues (e.g., Applications “12” new).

TOP HEADER (fixed within main content)
- Left: page title (changes by section)
- Center: global search bar (search creators/restaurants by name, email, username)
- Right: admin profile icon + logout

============================================================
1) APPLICATIONS QUEUE (Creators + Restaurants)
PAGE TITLE: “Applications”
- Tabs at top: “Creators” | “Restaurants”
- Default filter: Status = “Pending”

LEFT PANEL (table list)
Columns:
- Name (creator or restaurant)
- Type (Creator/Restaurant)
- City/State
- Submitted date
- Status pill (Pending/Approved/Rejected)
- Chevron
Filters (above table):
- Status dropdown
- Date range
- Sort (Newest first)

RIGHT DETAIL PANEL (selected application)
Creator application detail shows:
- Profile photo
- Full name
- Email, phone
- City/state
- Instagram username (locked field)
- TikTok username (locked field)
- Quick links to their IG/TikTok profiles (icons)
- Notes section (internal only)
Actions:
- Approve (primary)
- Reject (secondary) → opens rejection modal with reason templates + optional custom note
- After action, show toast “Approved” / “Rejected” and move to next item

Restaurant application detail shows:
- Restaurant logo
- Restaurant name
- Address
- Email, phone, website
- Locations/chain info (if applicable)
- Notes section
Actions:
- Approve / Reject with reason modal

============================================================
2) SUBMISSIONS QUEUE (Video/Post review)
PAGE TITLE: “Submissions”
- Filters at top:
  - Status: Pending / Approved / Rejected
  - Date range
  - Restaurant dropdown
  - Creator dropdown/search

LEFT PANEL (table list)
Columns:
- Creator
- Restaurant
- Submitted date/time
- Status
- Deadline remaining (optional)
- Chevron

RIGHT DETAIL PANEL (selected submission)
- Order summary:
  - Items + quantities
  - Total value comped (menu price based)
  - Timestamps: Ordered / Scanned / Submitted
- Deliverables snapshot (what was required at the time):
  - Platform deliverables
  - Minimum video length
  - Required hashtags/tags
  - Caption requirements, talking points
  - Mention location
  - Avoid topics (fixed)
  - Usage rights toggle state (on/off)
- Submitted links:
  - Instagram icon hyperlink
  - TikTok icon hyperlink
- Quick compliance checklist (internal):
  - Checkboxes for: hashtags present, tags present, product featured, etc. (manual)
Actions:
- Approve (primary)
- Reject (secondary) → modal:
  - Select reasons (multi-select templates)
  - Optional notes to creator
  - “Submit rejection”
- Optional: “Strike” toggle (internal) with warning count

============================================================
3) SUPPORT INBOX (Contact Us)
PAGE TITLE: “Support”
LEFT PANEL (tickets list)
Columns:
- From (name/email)
- Topic
- Date
- Status (Open/Waiting/Closed)
Filters:
- Status
- Topic
- Date

RIGHT DETAIL PANEL (ticket view)
- Message content (read-only)
- User type: Creator / Restaurant / Unknown
- Linked account (if matched by email)
- Reply box:
  - Subject
  - Message body
  - Canned responses dropdown
  - Button: “Send reply” (primary)
- Status controls:
  - Mark as Waiting
  - Close ticket

============================================================
4) CREATORS DIRECTORY (browse/search all creators)
PAGE TITLE: “Creators”
LEFT PANEL (table)
Columns:
- Creator name + photo
- City/state
- Email
- IG username
- TikTok username
- Total comps (lifetime)
- Status (Active/Restricted/Banned)
Top controls:
- Search
- Filters: status, city, date joined

RIGHT DETAIL PANEL (creator profile)
Profile details:
- Photo, name
- Email, phone
- City/state
- IG/TikTok usernames + clickable icons
Creator analytics (lifetime + filter dropdown: Month/Year/All time):
- Total comps completed
- Total views, likes, comments, shares (aggregated from submitted URLs)
- Avg engagement per post (optional)
- Recent completed comps list (last 5) with links to order details
Actions (internal):
- Restrict account / Ban account (with confirmation modal)
- Add internal notes

============================================================
5) RESTAURANTS DIRECTORY (browse/search all restaurants)
PAGE TITLE: “Restaurants”
LEFT PANEL (table)
Columns:
- Restaurant name + logo
- City/state
- Contact email
- Monthly budget
- Spend this month
- Status (Active/Paused)
Top controls:
- Search
- Filters: status, city, chain

RIGHT DETAIL PANEL (restaurant profile)
Profile details:
- Logo, name
- Address(es)
- Email, phone, website
Business settings snapshot:
- Monthly budget amount
- Creator cooldown (weeks, chain-wide)
- Total item limit per order
Restaurant analytics (with filter dropdown Month/Year/All time):
- Total comps
- Total spend
- Total views/likes/comments/shares driven (combined)
- Top 5 creators for this restaurant (combined performance)
Actions:
- Pause restaurant (stop new comps) / Resume
- Edit budget (opens modal)
- Internal notes

GENERAL UX / POLISH
- Use status pills (Pending/Approved/Rejected, Open/Closed, Active/Banned).
- Every action creates a confirmation toast and writes to an “Audit log” panel (optional).
- Keep UI extremely clean, professional, and fast to navigate.