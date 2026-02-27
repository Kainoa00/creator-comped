# AGENT_CONTEXT.md — CreatorComped Foundation Reference
**Read this entire file before writing a single line of code.**

This document is the single source of truth for all three parallel feature agents:
- **Creator Portal Agent** — builds `/creator/*` routes
- **Restaurant Portal Agent** — builds `/restaurant/*` routes
- **Admin Panel Agent** — builds `/admin/*` routes

---

## 1. What CreatorComped Is

CreatorComped is an **invite-only creator network** for Utah County and Salt Lake County restaurants. The business model:

1. A creator discovers a participating restaurant on the map
2. They select menu items (up to the restaurant's configured cap) and generate a QR code + 5-digit code
3. At the restaurant, a staff member scans the QR or enters the 5-digit code to confirm the order
4. The creator has **48 hours** to post an Instagram Reel and/or TikTok video per the restaurant's requirements
5. The creator submits their post URL as proof
6. Admin reviews the proof and approves/rejects
7. Approved proofs enter the monthly contest leaderboard (score = Views + Likes×5 + Comments×25)
8. Monthly winner gets a cash prize

Creators can be **banned or struck** for not posting, private accounts, engagement fraud, etc.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 (config via `@theme` in globals.css) |
| Database | Supabase (PostgreSQL + Realtime) |
| Auth | Supabase Auth (not yet wired — demo mode for now) |
| Map | react-map-gl + mapbox-gl |
| State | Zustand |
| Icons | lucide-react |
| QR codes | qrcode.react |
| Dates | date-fns |
| Radix UI | Dialog, DropdownMenu, Tabs, Toast, AlertDialog, Select, Switch, Avatar |
| Variants | class-variance-authority + clsx + tailwind-merge |

**Important:** The project uses **Tailwind v4**, which does NOT use `tailwind.config.ts`. All tokens are declared in `app/globals.css` under `@theme inline`. See Section 3.

---

## 3. Design System

### Color Classes (use these EXACTLY — they are registered in @theme)

```
Background:
  bg-cc-bg              #080B14  — primary page background
  bg-cc-bg-secondary    #0F1420  — section backgrounds, sidebars
  bg-cc-card            #141927  — cards, modals, inputs, dropdowns

Borders:
  border-cc-border      #1E2A45  — all borders/dividers
  divide-cc-border               — dividers between items

Accent (primary brand orange):
  bg-cc-accent          #FF6B35  — primary CTA buttons, key highlights
  bg-cc-accent-light    #FF8C5A  — hover state
  bg-cc-accent-dark     #E55A25  — active/pressed state
  text-cc-accent                 — accent text, icons
  border-cc-accent               — accent borders
  ring-cc-accent                 — focus rings

Status colors:
  text-cc-success / bg-cc-success    #10B981  — approved, confirmed, success
  text-cc-warning / bg-cc-warning    #F59E0B  — pending, needs fix, warning
  text-cc-error / bg-cc-error        #EF4444  — rejected, strikes, danger, urgent

Text:
  text-cc-text            #F8FAFC  — primary text (body, headings)
  text-cc-text-secondary  #94A3B8  — secondary labels, descriptions
  text-cc-text-muted      #64748B  — placeholders, disabled, timestamps
```

### Border Radius Tokens

```
rounded-[8px]   — inputs, icon buttons, small chips (cc-sm)
rounded-[12px]  — cards, main buttons, modals (cc)
rounded-[16px]  — large modals, prominent cards (cc-lg)
rounded-[24px]  — bottom sheets, hero elements (cc-xl)
rounded-full    — badges, avatars, pills
```

### Typography Scale

```
text-xs (12px)  — timestamps, helper text, badges
text-sm (14px)  — body text, button labels, list items
text-base (16px) — subheadings, emphasized body
text-lg (18px)  — section titles
text-xl (20px)  — page subtitles
text-2xl (24px) — page titles (mobile)
text-3xl (30px) — page titles (desktop)
text-4xl+       — hero headlines
font-medium     — most labels
font-semibold   — card titles, button text, section headings
font-bold       — page headings
font-black      — hero text, countdown digits, logo
```

### Common Patterns

**Dark card with hover:**
```tsx
<div className="bg-cc-card border border-cc-border rounded-[12px] p-4 hover:border-cc-text-muted transition-colors cursor-pointer">
```

**Section with secondary bg:**
```tsx
<section className="bg-cc-bg-secondary border-t border-cc-border py-6 px-4">
```

**Divider:**
```tsx
<div className="border-t border-cc-border" />
```

**Muted label + value pair:**
```tsx
<div className="flex flex-col gap-0.5">
  <span className="text-xs text-cc-text-muted uppercase tracking-wider">Label</span>
  <span className="text-sm font-medium text-cc-text">Value</span>
</div>
```

**Orange glow on accent elements:**
```tsx
className="shadow-lg shadow-cc-accent/20"
```

---

## 4. File Structure

```
webapp/
├── app/
│   ├── globals.css              — Tailwind v4 @theme tokens + CSS custom props
│   ├── layout.tsx               — Root layout: Inter font, ToastProvider, metadata
│   ├── page.tsx                 — Landing page: portal selection
│   ├── creator/
│   │   └── page.tsx             — Placeholder (Creator Portal Agent builds here)
│   ├── restaurant/
│   │   └── page.tsx             — Placeholder (Restaurant Portal Agent builds here)
│   └── admin/
│       └── page.tsx             — Placeholder (Admin Panel Agent builds here)
│
├── components/
│   ├── cc-logo.tsx              — CCLogo, CCLogoWithMark components
│   └── ui/
│       ├── button.tsx           — Button with variants + loading state
│       ├── card.tsx             — Card, CardHeader, CardTitle, CardBody, CardFooter
│       ├── badge.tsx            — Badge + OrderStatusBadge + ProofStatusBadge
│       ├── input.tsx            — Input, Textarea, PinInput
│       ├── modal.tsx            — Modal (Radix Dialog), ModalFooter
│       ├── spinner.tsx          — Spinner, FullPageSpinner
│       ├── countdown.tsx        — Countdown, CountdownCard
│       ├── avatar.tsx           — Avatar, AvatarWithText
│       └── toast.tsx            — ToastProvider, useToast hook
│
├── lib/
│   ├── types.ts                 — All shared TypeScript types
│   ├── supabase.ts              — supabase client, isDemoMode, createServerClient
│   ├── utils.ts                 — cn(), date/time utils, score, formatting
│   └── demo-data.ts             — Full mock dataset for demo/dev mode
│
├── schema.sql                   — Supabase schema (run in SQL editor)
├── .env.example                 — Environment variable template
└── AGENT_CONTEXT.md             — This file
```

---

## 5. TypeScript Types

Import from `@/lib/types`. Key types:

```typescript
import type {
  Creator, Restaurant, MenuItem, DeliverableRequirement,
  Order, OrderItem, OrderStatus,
  ProofSubmission, ProofPlatform, ProofReviewStatus,
  AnalyticsSnapshot, ContestEntry, Strike,
  CartItem, ApiResponse, UserRole,
  LeaderboardEntry, InviteApplication, Notification,
  DayHours, RestaurantHours, RestaurantSettings,
  DeliverableType, StrikeReason
} from '@/lib/types'
```

### Key Type Notes

- `Order.items` is `OrderItem[]` — array of `{ menu_item_id, menu_item_name, qty }`
- `Order.deliverable_requirement` is `DeliverableRequirement | null`
- `Restaurant.hours` is `RestaurantHours` (Record of day keys to DayHours)
- `Restaurant.settings` is `RestaurantSettings` (daily cap, blackout, cooldown, etc.)
- `CartItem` is client-side only: `{ menu_item: MenuItem, qty: number }`
- `ProofReviewStatus`: `'pending' | 'approved' | 'needs_fix' | 'rejected'`
- `OrderStatus`: `'created' | 'scanned' | 'confirmed' | 'proof_submitted' | 'approved' | 'rejected' | 'expired'`
- `StrikeReason`: `'missed_deadline' | 'invalid_url' | 'account_private' | 'post_removed' | 'content_violation' | 'engagement_fraud' | 'other'`

---

## 6. Shared Components — API Reference

### Button (`@/components/ui/button`)
```tsx
import { Button } from '@/components/ui/button'

<Button
  variant="primary"       // 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success'
  size="md"               // 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg'
  loading={false}         // Shows spinner, disables button
  leftIcon={<Icon />}     // Icon before text
  rightIcon={<Icon />}    // Icon after text
  disabled={false}
  onClick={handler}
>
  Button Text
</Button>
```

### Card (`@/components/ui/card`)
```tsx
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from '@/components/ui/card'

<Card
  hover={true}           // Adds hover lift + border transition
  highlighted={false}    // Adds cc-accent left border accent
  className="..."
>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <Badge>Status</Badge>
  </CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge (`@/components/ui/badge`)
```tsx
import { Badge, OrderStatusBadge, ProofStatusBadge } from '@/components/ui/badge'

<Badge variant="success" dot size="sm">Approved</Badge>
// variants: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'accent'

// Convenience components:
<OrderStatusBadge status={order.status} />
<ProofStatusBadge status={proof.review_status} />
```

### Input (`@/components/ui/input`)
```tsx
import { Input, Textarea, PinInput } from '@/components/ui/input'

<Input
  label="Instagram URL"
  placeholder="https://www.instagram.com/reel/..."
  error="Invalid URL format"
  hint="Must be a public Reel"
  leftAddon={<LinkIcon className="h-4 w-4" />}
/>

<Textarea label="Notes" rows={3} />

// PIN entry for restaurant manager:
<PinInput
  value={pin}
  onChange={setPin}
  length={4}
  label="Manager PIN"
  error={pinError}
/>
```

### Modal (`@/components/ui/modal`)
```tsx
import { Modal, ModalFooter } from '@/components/ui/modal'

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Order"
  description="Optional subtitle text"
  placement="default"    // 'default' (centered) | 'bottom' (mobile sheet)
  maxWidth="max-w-lg"
>
  <p>Modal content here</p>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </ModalFooter>
</Modal>
```

### Spinner (`@/components/ui/spinner`)
```tsx
import { Spinner, FullPageSpinner } from '@/components/ui/spinner'

<Spinner size="md" />   // 'sm' | 'md' | 'lg' | 'xl'
<FullPageSpinner />     // Full-screen loading overlay
```

### Countdown (`@/components/ui/countdown`)
```tsx
import { Countdown, CountdownCard } from '@/components/ui/countdown'

// Simple countdown display — goes red when < 5 min remaining
<Countdown
  deadline="2026-02-26T20:00:00Z"
  onExpired={() => handleExpired()}
  showHours={false}     // true = HH:MM:SS, false = MM:SS
  size="md"             // 'sm' | 'md' | 'lg'
/>

// Full card with urgency messaging (for 48h proof deadline):
<CountdownCard
  deadline={proof.deadline}
  onExpired={handleExpired}
  label="Time remaining to submit proof"
/>
```

### Avatar (`@/components/ui/avatar`)
```tsx
import { Avatar, AvatarWithText } from '@/components/ui/avatar'

<Avatar
  src={creator.photo_url}   // null = shows initials
  name={creator.name}
  size="md"                 // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
/>

<AvatarWithText
  src={creator.photo_url}
  name={creator.name}
  subtitle="@mia.eats.utah"
  size="sm"
/>
```

### Toast / useToast (`@/components/ui/toast`)
```tsx
'use client'
import { useToast } from '@/components/ui/toast'

function MyComponent() {
  const { toast } = useToast()

  function handleAction() {
    toast({
      type: 'success',          // 'success' | 'error' | 'warning' | 'info'
      title: 'Order confirmed!',
      message: 'Your meal is being prepared.',  // optional
      duration: 5000,           // optional, default 5000ms
    })
  }
}
// ToastProvider is already in app/layout.tsx — do NOT add it again
```

### CCLogo (`@/components/cc-logo`)
```tsx
import { CCLogo, CCLogoWithMark } from '@/components/cc-logo'

<CCLogo size="md" />              // Text: "CreatorComped" (gray + orange)
<CCLogoWithMark size="md" />      // Orange square mark + text
// sizes: 'sm' | 'md' | 'lg' | 'xl'
```

---

## 7. Utility Functions (`@/lib/utils`)

```typescript
import {
  cn,                    // Merge Tailwind classes: cn('base', condition && 'conditional', className)
  generateRedemptionCode, // () => string — random 5-digit string
  generateQRToken,        // () => string — 'CC-{timestamp}-{random}'
  getCodeExpiry,          // () => string — ISO timestamp 20 min from now
  isExpired,              // (expiresAt: string) => boolean
  secondsRemaining,       // (expiresAt: string) => number (clamped to 0)
  formatCountdown,        // (seconds: number) => 'MM:SS'
  format48hCountdown,     // (deadline: string) => 'HH:MM:SS'
  computeScore,           // (views, likes, comments) => number
  isInBlackout,           // (start: string|null, end: string|null) => boolean
  relativeTime,           // (date: string) => '2 hours ago'
  formatDate,             // (date: string) => '02/26/2026'
  formatDateLong,         // (date: string) => 'February 26, 2026'
  formatTime,             // (date: string) => '2:30 PM'
  getInitials,            // (name: string) => 'MT' (first 2 words)
  truncate,               // (str: string, maxLength: number) => string
  formatNumber,           // (n: number) => '1.2K' | '4.5M'
  currentMonthKey,        // () => 'YYYY-MM'
  formatCurrency,         // (cents: number) => '$12.50'
  deepClone,              // <T>(obj: T) => T (JSON roundtrip)
  sleep,                  // (ms: number) => Promise<void>
} from '@/lib/utils'
```

---

## 8. Demo Data (`@/lib/demo-data`)

When `isDemoMode` is true (no Supabase env vars), use this data for all UI.

```typescript
import {
  DEMO_CREATORS,            // Creator[] — 2 creators
  DEMO_ACTIVE_CREATOR,      // Creator — the logged-in creator (Mia Tanaka)
  DEMO_RESTAURANTS,         // Restaurant[] — 3 Provo restaurants
  DEMO_MENU_ITEMS,          // MenuItem[] — 9 menu items across restaurants
  DEMO_DELIVERABLE_REQUIREMENTS, // DeliverableRequirement[] — 3 requirements
  DEMO_ORDERS,              // Order[] — 4 orders in various statuses
  DEMO_PROOF_SUBMISSIONS,   // ProofSubmission[] — 2 proofs
  DEMO_ANALYTICS_SNAPSHOTS, // AnalyticsSnapshot[] — 4 snapshots for proof-002
  DEMO_CONTEST_ENTRIES,     // ContestEntry[] — 5 leaderboard entries
  DEMO_STRIKES,             // Strike[] — 1 strike

  // Helper functions:
  getMenuItemsForRestaurant,  // (restaurantId: string) => MenuItem[]
  getDeliverableForRestaurant, // (restaurantId: string) => DeliverableRequirement | null
  getOrdersForCreator,        // (creatorId: string) => Order[]
  getProofForOrder,           // (orderId: string) => ProofSubmission | null
  getLatestSnapshot,          // (proofId: string) => AnalyticsSnapshot | null
  getLeaderboard,             // (month: string) => ContestEntry[] sorted by score desc
} from '@/lib/demo-data'
```

**Demo IDs:**
- Active creator: `'creator-001'` (Mia Tanaka, verified)
- Restaurants: `'restaurant-001'` (Brick Oven), `'restaurant-002'` (Station 22), `'restaurant-003'` (Cubby's)
- Active confirmed order (ready for proof): `'order-001'` (status: `'confirmed'`)
- Pending proof: `'proof-001'` (review_status: `'pending'`)

---

## 9. Supabase Usage Pattern

```typescript
import { supabase, isDemoMode } from '@/lib/supabase'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'
import type { Restaurant } from '@/lib/types'

async function fetchRestaurants(): Promise<Restaurant[]> {
  if (isDemoMode || !supabase) {
    return DEMO_RESTAURANTS
  }
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('active', true)
  if (error) throw error
  return data as Restaurant[]
}
```

**Always check `isDemoMode` before any Supabase call.**

---

## 10. Route Architecture

### Creator Portal (`/creator/*`)
**Design constraint: Mobile-first. Max-width container: `max-w-md mx-auto`. Bottom navigation bar.**

| Route | Purpose |
|-------|---------|
| `/creator` | Dashboard / home — active order if any, else prompt to discover |
| `/creator/discover` | Full-screen map (react-map-gl) with restaurant markers + bottom sheet list |
| `/creator/restaurant/[id]` | Restaurant detail — menu, requirements, "Add to cart" |
| `/creator/cart` | Cart review — selected items, deliverable requirements, "Generate Code" |
| `/creator/redeem` | QR code + 5-digit code display with countdown timer |
| `/creator/proof` | 48h countdown + URL submission form for active confirmed order |
| `/creator/history` | Past orders list with statuses |
| `/creator/profile` | Creator profile — handles, strike count, ban status |

**Bottom nav items:** Discover (Map), Orders (Clock), Profile (User)

**Key UI flows:**
1. Discover → Restaurant detail → Add items → Cart → Generate code → Redeem screen (countdown)
2. After restaurant scans: order status updates → Proof submission screen (CountdownCard 48h)
3. After admin approves: order shows "Approved" badge, score shown in History

### Restaurant Portal (`/restaurant/*`)
**Design constraint: iPad-optimized. Min-width: 768px. No bottom nav — top nav or sidebar.**

| Route | Purpose |
|-------|---------|
| `/restaurant` | Restaurant selection / login (by manager PIN) |
| `/restaurant/scan` | QR scanner — use device camera or manual 5-digit code entry |
| `/restaurant/ticket/[orderId]` | Order ticket — creator info, items, confirm/reject buttons |
| `/restaurant/confirmed` | Success screen after confirming an order |
| `/restaurant/manager` | Manager mode (requires PIN) — settings, daily cap, blackout, pause toggle |
| `/restaurant/history` | Today's comp history for this restaurant |

**Key UI flows:**
1. Staff opens /restaurant/scan → scans QR or types 5-digit code → redirected to /restaurant/ticket/[id]
2. Ticket screen shows creator photo/handle, items, deliverable requirements
3. Manager hits "Confirm" → order status: confirmed → staff sees success screen
4. Manager mode: enter PIN → access settings panel

**Important:** The 5-digit code search must look up by `orders.redemption_code`. The QR code encodes `orders.qr_token`.

### Admin Panel (`/admin/*`)
**Design constraint: Desktop-first. Sidebar navigation. Full-width content area.**

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard — key metrics (pending proofs, today's comps, new applications) |
| `/admin/vetting` | Invite application queue — approve/reject with notes |
| `/admin/creators` | All creators — search, filter by status/strikes, view profiles |
| `/admin/creators/[id]` | Creator detail — orders, proofs, strikes history |
| `/admin/proof` | Proof review queue — list of pending proofs with links |
| `/admin/proof/[id]` | Single proof review — URL, screenshot, analytics, approve/reject |
| `/admin/strikes` | Issue strikes to creators — form with reason + notes |
| `/admin/leaderboard` | Monthly contest leaderboard by platform (IG/TikTok) |
| `/admin/restaurants` | Restaurant management — add, edit settings, pause comps |
| `/admin/restaurants/[id]` | Restaurant detail — menu items, deliverable requirements |

**Sidebar items:** Dashboard, Vetting, Creators, Proofs, Strikes, Leaderboard, Restaurants

---

## 11. Design Patterns to Follow

### Server vs Client Components

- Page components (`page.tsx`) should be **Server Components** by default
- Only add `'use client'` when you need: `useState`, `useEffect`, event handlers, browser APIs, Radix UI, or real-time subscriptions
- Prefer fetching data in Server Components and passing as props

### Loading States

```tsx
// In a client component with async data:
const [loading, setLoading] = useState(true)
const [data, setData] = useState<Restaurant[]>([])

if (loading) return <FullPageSpinner />
```

### Error Handling

```tsx
const [error, setError] = useState<string | null>(null)

if (error) return (
  <div className="flex flex-col items-center gap-3 py-12">
    <p className="text-cc-error">{error}</p>
    <Button variant="outline" onClick={retry}>Try Again</Button>
  </div>
)
```

### Empty State

```tsx
<div className="flex flex-col items-center gap-3 py-16 text-center">
  <div className="h-16 w-16 rounded-full bg-cc-card border border-cc-border flex items-center justify-center">
    <IconName className="h-7 w-7 text-cc-text-muted" />
  </div>
  <p className="font-semibold text-cc-text">No items yet</p>
  <p className="text-sm text-cc-text-secondary">Helpful description of what to do</p>
</div>
```

### List Items (consistent padding)

```tsx
<ul className="divide-y divide-cc-border">
  {items.map(item => (
    <li key={item.id} className="flex items-center gap-3 py-3 px-4">
      {/* content */}
    </li>
  ))}
</ul>
```

### Section Headers

```tsx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-base font-semibold text-cc-text">Section Title</h2>
  <Button variant="ghost" size="sm">See all</Button>
</div>
```

### Page Headers (mobile — Creator Portal)

```tsx
<header className="sticky top-0 z-20 bg-cc-bg/95 backdrop-blur border-b border-cc-border">
  <div className="max-w-md mx-auto flex items-center justify-between h-14 px-4">
    <h1 className="text-lg font-bold text-cc-text">Page Title</h1>
    <Button variant="ghost" size="icon"><BellIcon /></Button>
  </div>
</header>
```

### Page Headers (desktop — Admin Panel)

```tsx
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold text-cc-text">Page Title</h1>
    <p className="text-sm text-cc-text-secondary mt-0.5">Subtitle</p>
  </div>
  <Button variant="primary" leftIcon={<PlusIcon />}>Add Item</Button>
</div>
```

### Confirmation Dialogs

```tsx
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

<Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Action">
  <p className="text-cc-text-secondary">Are you sure you want to do this?</p>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancel</Button>
    <Button variant="danger" loading={isLoading} onClick={handleConfirm}>Delete</Button>
  </ModalFooter>
</Modal>
```

---

## 12. Portal-Specific Design Notes

### Creator Portal (Mobile-First)
- **Viewport:** Designed for iPhone-class screens (375–430px wide)
- **Container:** `<div className="max-w-md mx-auto">`
- **Bottom navigation:** Fixed `bottom-0` bar, `h-16`, `bg-cc-bg/95 backdrop-blur border-t border-cc-border`
- **Content padding:** Account for bottom nav with `pb-20` on main content
- **Touch targets:** All interactive elements min `44px` tall (`h-11` minimum)
- **The QR code** (from qrcode.react): render at 220px square, centered, with CC orange border
- **Countdown timer:** Use `<CountdownCard>` for proof deadline, `<Countdown size="lg">` for code expiry
- **Map:** Full-height (`h-[calc(100dvh-64px-64px)]`), markers as CC orange circles

### Restaurant Portal (iPad-Optimized)
- **Viewport:** Designed for iPad (768–1024px), but must work on desktop too
- **Layout:** No sidebar — use top navbar with restaurant name + mode indicator
- **Scanner:** The scan screen should show a large camera viewport (mock with a dashed border + QR icon in demo mode) + manual code entry below
- **Ticket view:** Two-column on tablet (creator info left, items + actions right)
- **Manager mode:** Gated behind PIN — use the `<PinInput>` component
- **Colors in scan flow:** Use full-screen green flash (`bg-cc-success`) on successful confirm

### Admin Panel (Desktop-First)
- **Viewport:** Min-width 1024px, sidebar + main content layout
- **Sidebar:** Fixed `w-64`, `bg-cc-bg-secondary border-r border-cc-border`, full height
- **Sidebar nav items:** Icon + label, active item gets `bg-cc-card text-cc-accent border-r-2 border-cc-accent`
- **Content area:** `flex-1 overflow-y-auto p-6 bg-cc-bg`
- **Tables:** Use `<table>` with `bg-cc-card rounded-[12px] overflow-hidden`, `border-cc-border` dividers
- **Data tables:** Sticky header, sortable columns (client-side sort for demo)
- **Proof review:** Show iframe/image preview of the submission URL if possible; fallback to link

---

## 13. Zustand Store Pattern

For complex state (cart, active creator session, etc.), use Zustand:

```typescript
// lib/stores/cart-store.ts
'use client'
import { create } from 'zustand'
import type { CartItem, MenuItem } from '@/lib/types'

interface CartStore {
  restaurantId: string | null
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  updateQty: (itemId: string, qty: number) => void
  clearCart: () => void
  totalItems: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  restaurantId: null,
  items: [],
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.menu_item.id === item.id)
    if (existing) {
      return {
        items: state.items.map(i =>
          i.menu_item.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
    }
    return { items: [...state.items, { menu_item: item, qty: 1 }] }
  }),
  removeItem: (itemId) => set(state => ({
    items: state.items.filter(i => i.menu_item.id !== itemId)
  })),
  updateQty: (itemId, qty) => set(state => ({
    items: qty === 0
      ? state.items.filter(i => i.menu_item.id !== itemId)
      : state.items.map(i => i.menu_item.id === itemId ? { ...i, qty } : i)
  })),
  clearCart: () => set({ items: [], restaurantId: null }),
  totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}))
```

---

## 14. Score Computation

The contest score formula is: `Views + (Likes × 5) + (Comments × 25)`

Use the `computeScore` utility from `@/lib/utils`. When displaying scores, use `formatNumber` for large values (e.g., 69,325 → "69.3K").

---

## 15. Key Business Rules (implement these correctly)

1. **Order expiry:** QR codes expire 20 minutes after creation (if not scanned). Use `isExpired(order.expires_at)`.

2. **Proof deadline:** 48 hours after `order.confirmed_at`. Calculate as: `new Date(order.confirmed_at!).getTime() + 48*60*60*1000`.

3. **Daily comp cap:** If `restaurant.settings.daily_comp_cap` is set, check today's confirmed orders count before allowing new order generation.

4. **Blackout hours:** Use `isInBlackout(settings.blackout_start, settings.blackout_end)` before allowing order generation.

5. **Cooldown:** A creator cannot comp at the same restaurant within `settings.cooldown_days` days.

6. **Cart limits:** Max items per order = `restaurant.settings.max_items_per_order`. Enforce in cart.

7. **Strike escalation:**
   - 1 strike = warning
   - 2 strikes = 7-day temporary ban
   - 3 strikes = permanent ban

8. **Pause comps:** If `restaurant.settings.pause_comps === true`, the restaurant should NOT appear as available for new orders (show "Paused" badge on map).

9. **Verified badge:** Only verified creators (creator.verified === true) can generate orders.

10. **Banned creators:** Check `creator.ban_state` and `creator.ban_until` before allowing order generation.

---

## 16. QR Code Implementation

```typescript
// In the redemption screen (Creator Portal):
import QRCode from 'qrcode.react'

// The QR encodes the qr_token for unambiguous lookup
<QRCode
  value={order.qr_token}
  size={220}
  bgColor="#141927"           // cc-card
  fgColor="#FF6B35"           // cc-accent (orange QR!)
  level="M"
  includeMargin
/>
```

---

## 17. Map Implementation

```typescript
// In the discover screen (Creator Portal):
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

// Utah County center:
const INITIAL_VIEW = {
  latitude: 40.2338,
  longitude: -111.6588,
  zoom: 12,
}

// Use 'mapbox://styles/mapbox/dark-v11' for the CC dark theme
```

---

## 18. Import Alias

The project uses `@/*` mapped to the root. Use this for all imports:
```typescript
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Order } from '@/lib/types'
```

---

## 19. Do NOT Do

- Do NOT install additional packages without noting it (the tech stack is locked)
- Do NOT create `tailwind.config.ts` — this is Tailwind v4, config is in `globals.css`
- Do NOT add another `<ToastProvider>` — it's already in `app/layout.tsx`
- Do NOT use `next/image` with external dicebear URLs without adding domains to `next.config.ts` — use `<img>` for external avatar URLs in demo mode, or add the domain
- Do NOT use `'use client'` on page.tsx files unless absolutely necessary — prefer passing data as props from server to client child components
- Do NOT hardcode colors as hex values — always use the Tailwind cc-* color classes

---

## 20. next.config.ts

If you need to add image domains (e.g., for creator photos from Supabase storage), update `next.config.ts`:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',  // for demo avatars
      },
    ],
  },
}

export default nextConfig
```

---

*End of AGENT_CONTEXT.md — Foundation Agent, February 2026*
