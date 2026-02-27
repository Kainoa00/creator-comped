// ============================================================
// CreatorComped — Demo Data (used when isDemoMode = true)
// All IDs are deterministic UUIDs for stable references.
// ============================================================

import type {
  Creator,
  Restaurant,
  MenuItem,
  DeliverableRequirement,
  Order,
  ProofSubmission,
  AnalyticsSnapshot,
  ContestEntry,
  Strike,
} from './types'

// ─────────────────────────────────────────────────────────────
// CREATORS
// ─────────────────────────────────────────────────────────────
export const DEMO_CREATORS: Creator[] = [
  {
    id: 'creator-001',
    name: 'Mia Tanaka',
    photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mia',
    email: 'mia.tanaka@example.com',
    phone: '(801) 555-0192',
    ig_handle: '@mia.eats.utah',
    tiktok_handle: '@miaeatsutah',
    verified: true,
    invite_code: 'CC-MIA-2024',
    strike_count: 0,
    ban_state: 'none',
    ban_until: null,
    geo_market: 'utah_county',
    created_at: '2024-09-15T10:00:00Z',
  },
  {
    id: 'creator-002',
    name: 'Jordan Reyes',
    photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
    email: 'jordan.reyes@example.com',
    phone: '(385) 555-0847',
    ig_handle: '@jordan.foodie',
    tiktok_handle: '@jordanfoodie',
    verified: false,
    invite_code: 'CC-JOR-2024',
    strike_count: 1,
    ban_state: 'none',
    ban_until: null,
    geo_market: 'utah_county',
    created_at: '2024-10-22T14:30:00Z',
  },
]

/** The "active" demo creator for the Creator Portal */
export const DEMO_ACTIVE_CREATOR = DEMO_CREATORS[0]

// ─────────────────────────────────────────────────────────────
// RESTAURANTS
// ─────────────────────────────────────────────────────────────
export const DEMO_RESTAURANTS: Restaurant[] = [
  {
    id: 'restaurant-001',
    name: 'Brick Oven Restaurant',
    address: '111 E 800 N, Provo, UT 84606',
    lat: 40.2477,
    lng: -111.6561,
    hours: {
      mon: { open: '11:00', close: '22:00', closed: false },
      tue: { open: '11:00', close: '22:00', closed: false },
      wed: { open: '11:00', close: '22:00', closed: false },
      thu: { open: '11:00', close: '22:00', closed: false },
      fri: { open: '11:00', close: '23:00', closed: false },
      sat: { open: '11:00', close: '23:00', closed: false },
      sun: { open: '12:00', close: '21:00', closed: false },
    },
    manager_pin: '1234',
    settings: {
      daily_comp_cap: 5,
      blackout_start: '12:00',
      blackout_end: '13:30',
      cooldown_days: 14,
      max_items_per_order: 2,
      pause_comps: false,
    },
    active: true,
    created_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'restaurant-002',
    name: 'Station 22',
    address: '22 W Center St, Provo, UT 84601',
    lat: 40.2338,
    lng: -111.6588,
    hours: {
      mon: { open: '11:00', close: '22:00', closed: false },
      tue: { open: '11:00', close: '22:00', closed: false },
      wed: { open: '11:00', close: '22:00', closed: false },
      thu: { open: '11:00', close: '22:00', closed: false },
      fri: { open: '11:00', close: '23:30', closed: false },
      sat: { open: '10:00', close: '23:30', closed: false },
      sun: { open: '10:00', close: '21:00', closed: false },
    },
    manager_pin: '5678',
    settings: {
      daily_comp_cap: 3,
      blackout_start: null,
      blackout_end: null,
      cooldown_days: 7,
      max_items_per_order: 3,
      pause_comps: false,
    },
    active: true,
    created_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'restaurant-003',
    name: 'Cubby\'s Chicago Dogs',
    address: '223 N University Ave, Provo, UT 84601',
    lat: 40.2358,
    lng: -111.6592,
    hours: {
      mon: { open: '10:30', close: '22:00', closed: false },
      tue: { open: '10:30', close: '22:00', closed: false },
      wed: { open: '10:30', close: '22:00', closed: false },
      thu: { open: '10:30', close: '22:00', closed: false },
      fri: { open: '10:30', close: '23:00', closed: false },
      sat: { open: '10:30', close: '23:00', closed: false },
      sun: { open: '11:00', close: '21:00', closed: false },
    },
    manager_pin: '9012',
    settings: {
      daily_comp_cap: 4,
      blackout_start: '11:30',
      blackout_end: '13:00',
      cooldown_days: 10,
      max_items_per_order: 2,
      pause_comps: false,
    },
    active: true,
    created_at: '2024-09-15T00:00:00Z',
  },
]

// ─────────────────────────────────────────────────────────────
// MENU ITEMS
// ─────────────────────────────────────────────────────────────
export const DEMO_MENU_ITEMS: MenuItem[] = [
  // Brick Oven
  {
    id: 'item-001',
    restaurant_id: 'restaurant-001',
    name: 'Build-Your-Own Pizza (12")',
    description: 'Hand-tossed crust, house sauce, 3 toppings of your choice. A Provo classic since 1956.',
    image_url: null,
    max_qty_per_order: 1,
    estimated_cogs: 8.50,
    active: true,
    created_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'item-002',
    restaurant_id: 'restaurant-001',
    name: 'Garlic Parmesan Breadsticks',
    description: 'Freshly baked breadsticks brushed with garlic butter and parmesan. Comes with marinara.',
    image_url: null,
    max_qty_per_order: 2,
    estimated_cogs: 3.00,
    active: true,
    created_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'item-003',
    restaurant_id: 'restaurant-001',
    name: 'Pasta of the Day',
    description: 'Ask your server — house-made pasta rotating daily. Always fresh, always filling.',
    image_url: null,
    max_qty_per_order: 1,
    estimated_cogs: 6.00,
    active: true,
    created_at: '2024-09-01T00:00:00Z',
  },
  // Station 22
  {
    id: 'item-004',
    restaurant_id: 'restaurant-002',
    name: 'The 22 Burger',
    description: 'Double smash patty, American cheese, house sauce, crispy shallots on a brioche bun.',
    image_url: null,
    max_qty_per_order: 1,
    estimated_cogs: 7.25,
    active: true,
    created_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'item-005',
    restaurant_id: 'restaurant-002',
    name: 'Sweet Potato Fries',
    description: 'Thick-cut sweet potato fries with chipotle aioli for dipping.',
    image_url: null,
    max_qty_per_order: 2,
    estimated_cogs: 2.75,
    active: true,
    created_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'item-006',
    restaurant_id: 'restaurant-002',
    name: 'Craft Milkshake',
    description: 'Rotating seasonal flavors — strawberry, salted caramel, or cookies & cream.',
    image_url: null,
    max_qty_per_order: 2,
    estimated_cogs: 3.50,
    active: true,
    created_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'item-007',
    restaurant_id: 'restaurant-002',
    name: 'Loaded Nachos',
    description: 'Tortilla chips, queso, pulled pork, jalapeños, sour cream, and salsa verde.',
    image_url: null,
    max_qty_per_order: 1,
    estimated_cogs: 5.50,
    active: true,
    created_at: '2024-09-01T00:00:00Z',
  },
  // Cubby's
  {
    id: 'item-008',
    restaurant_id: 'restaurant-003',
    name: 'Chicago-Style Dog',
    description: 'All-beef frank, yellow mustard, neon relish, tomato, sport peppers, celery salt. Never ketchup.',
    image_url: null,
    max_qty_per_order: 2,
    estimated_cogs: 3.75,
    active: true,
    created_at: '2024-09-15T00:00:00Z',
  },
  {
    id: 'item-009',
    restaurant_id: 'restaurant-003',
    name: 'Italian Beef Sandwich',
    description: 'Thinly sliced seasoned beef, giardiniera, sweet peppers, au jus dip.',
    image_url: null,
    max_qty_per_order: 1,
    estimated_cogs: 8.00,
    active: true,
    created_at: '2024-09-15T00:00:00Z',
  },
]

// ─────────────────────────────────────────────────────────────
// DELIVERABLE REQUIREMENTS
// ─────────────────────────────────────────────────────────────
export const DEMO_DELIVERABLE_REQUIREMENTS: DeliverableRequirement[] = [
  {
    id: 'deliv-001',
    restaurant_id: 'restaurant-001',
    allowed_types: 'IG_REEL',
    required_hashtags: ['#CreatorComped', '#BrickOvenProvo', '#ProvoEats'],
    required_tags: ['@brickovenprovo'],
  },
  {
    id: 'deliv-002',
    restaurant_id: 'restaurant-002',
    allowed_types: 'CHOICE',
    required_hashtags: ['#CreatorComped', '#Station22', '#ProvoFoodie'],
    required_tags: ['@station22provo'],
  },
  {
    id: 'deliv-003',
    restaurant_id: 'restaurant-003',
    allowed_types: 'TIKTOK',
    required_hashtags: ['#CreatorComped', '#CubbysProvo', '#ChicagoDogChallenge'],
    required_tags: ['@cubbysprovo'],
  },
]

// ─────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────

// Helper: timestamp relative to now
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600 * 1000).toISOString()
}
function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 3600 * 1000).toISOString()
}
function daysAgo(d: number): string {
  return hoursAgo(d * 24)
}

export const DEMO_ORDERS: Order[] = [
  // Active confirmed order — ready for proof submission
  {
    id: 'order-001',
    creator_id: 'creator-001',
    restaurant_id: 'restaurant-002',
    restaurant_name: 'Station 22',
    items: [
      { menu_item_id: 'item-004', menu_item_name: 'The 22 Burger', qty: 1 },
      { menu_item_id: 'item-005', menu_item_name: 'Sweet Potato Fries', qty: 1 },
    ],
    status: 'confirmed',
    redemption_code: '48291',
    qr_token: 'CC-1710000000000-AB3XYZ9',
    expires_at: hoursFromNow(18), // QR already scanned, now waiting for proof
    created_at: hoursAgo(3),
    confirmed_at: hoursAgo(3),
    rejection_reason: null,
    deliverable_requirement: DEMO_DELIVERABLE_REQUIREMENTS[1],
  },
  // Past order — proof submitted, awaiting review
  {
    id: 'order-002',
    creator_id: 'creator-001',
    restaurant_id: 'restaurant-001',
    restaurant_name: 'Brick Oven Restaurant',
    items: [
      { menu_item_id: 'item-001', menu_item_name: 'Build-Your-Own Pizza (12")', qty: 1 },
      { menu_item_id: 'item-002', menu_item_name: 'Garlic Parmesan Breadsticks', qty: 1 },
    ],
    status: 'proof_submitted',
    redemption_code: '71038',
    qr_token: 'CC-1709900000000-CD5MNP2',
    expires_at: daysAgo(6),
    created_at: daysAgo(7),
    confirmed_at: daysAgo(7),
    rejection_reason: null,
    deliverable_requirement: DEMO_DELIVERABLE_REQUIREMENTS[0],
  },
  // Past order — approved
  {
    id: 'order-003',
    creator_id: 'creator-001',
    restaurant_id: 'restaurant-003',
    restaurant_name: "Cubby's Chicago Dogs",
    items: [
      { menu_item_id: 'item-008', menu_item_name: 'Chicago-Style Dog', qty: 2 },
    ],
    status: 'approved',
    redemption_code: '33947',
    qr_token: 'CC-1709800000000-EF7QRS4',
    expires_at: daysAgo(13),
    created_at: daysAgo(14),
    confirmed_at: daysAgo(14),
    rejection_reason: null,
    deliverable_requirement: DEMO_DELIVERABLE_REQUIREMENTS[2],
  },
  // Past order — rejected
  {
    id: 'order-004',
    creator_id: 'creator-002',
    restaurant_id: 'restaurant-001',
    restaurant_name: 'Brick Oven Restaurant',
    items: [
      { menu_item_id: 'item-003', menu_item_name: 'Pasta of the Day', qty: 1 },
    ],
    status: 'rejected',
    redemption_code: '59012',
    qr_token: 'CC-1709700000000-GH9TUV6',
    expires_at: daysAgo(20),
    created_at: daysAgo(21),
    confirmed_at: daysAgo(21),
    rejection_reason: 'Posted Reel was set to private. Please make public and resubmit.',
    deliverable_requirement: DEMO_DELIVERABLE_REQUIREMENTS[0],
  },
]

// ─────────────────────────────────────────────────────────────
// PROOF SUBMISSIONS
// ─────────────────────────────────────────────────────────────
export const DEMO_PROOF_SUBMISSIONS: ProofSubmission[] = [
  // Pending — matches order-002
  {
    id: 'proof-001',
    order_id: 'order-002',
    creator_id: 'creator-001',
    platform: 'IG_REEL',
    url: 'https://www.instagram.com/reel/CexampleReel001/',
    screenshot_url: null,
    submitted_at: daysAgo(5),
    review_status: 'pending',
    reviewer_notes: null,
    deadline: hoursFromNow(18), // 48h after confirmed_at of order-002
  },
  // Approved — matches order-003
  {
    id: 'proof-002',
    order_id: 'order-003',
    creator_id: 'creator-001',
    platform: 'TIKTOK',
    url: 'https://www.tiktok.com/@miaeatsutah/video/7000000000000000001',
    screenshot_url: null,
    submitted_at: daysAgo(13),
    review_status: 'approved',
    reviewer_notes: 'Great content! Excellent hashtag usage.',
    deadline: daysAgo(11),
  },
]

// ─────────────────────────────────────────────────────────────
// ANALYTICS SNAPSHOTS
// ─────────────────────────────────────────────────────────────
export const DEMO_ANALYTICS_SNAPSHOTS: AnalyticsSnapshot[] = [
  // Snapshots for proof-002 (approved TikTok)
  {
    id: 'snap-001',
    proof_id: 'proof-002',
    timestamp: daysAgo(12),
    views: 1200,
    likes: 89,
    comments: 14,
    shares: 22,
    score: 1200 + 89 * 5 + 14 * 25, // 2095
  },
  {
    id: 'snap-002',
    proof_id: 'proof-002',
    timestamp: daysAgo(11),
    views: 4800,
    likes: 312,
    comments: 47,
    shares: 88,
    score: 4800 + 312 * 5 + 47 * 25, // 7735
  },
  {
    id: 'snap-003',
    proof_id: 'proof-002',
    timestamp: daysAgo(10),
    views: 18700,
    likes: 1140,
    comments: 203,
    shares: 310,
    score: 18700 + 1140 * 5 + 203 * 25, // 30375
  },
  {
    id: 'snap-004',
    proof_id: 'proof-002',
    timestamp: daysAgo(7),
    views: 42300,
    likes: 2890,
    comments: 441,
    shares: 620,
    score: 42300 + 2890 * 5 + 441 * 25, // 69325
  },
]

// ─────────────────────────────────────────────────────────────
// CONTEST ENTRIES — Monthly Leaderboard
// ─────────────────────────────────────────────────────────────
export const DEMO_CONTEST_ENTRIES: ContestEntry[] = [
  {
    id: 'contest-001',
    proof_id: 'proof-002',
    creator_id: 'creator-001',
    creator_name: 'Mia Tanaka',
    creator_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mia',
    month: '2026-02',
    platform: 'TIKTOK',
    score: 69325,
    eligible: true,
    disqualified: false,
    disqualification_reason: null,
  },
  {
    id: 'contest-002',
    proof_id: 'proof-003',
    creator_id: 'creator-002',
    creator_name: 'Jordan Reyes',
    creator_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
    month: '2026-02',
    platform: 'IG_REEL',
    score: 51200,
    eligible: true,
    disqualified: false,
    disqualification_reason: null,
  },
  {
    id: 'contest-003',
    proof_id: 'proof-004',
    creator_id: 'creator-003',
    creator_name: 'Aaliyah Okonkwo',
    creator_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aaliyah',
    month: '2026-02',
    platform: 'TIKTOK',
    score: 38900,
    eligible: true,
    disqualified: false,
    disqualification_reason: null,
  },
  {
    id: 'contest-004',
    proof_id: 'proof-005',
    creator_id: 'creator-004',
    creator_name: 'Brett Sullivan',
    creator_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=brett',
    month: '2026-02',
    platform: 'IG_REEL',
    score: 29400,
    eligible: true,
    disqualified: false,
    disqualification_reason: null,
  },
  {
    id: 'contest-005',
    proof_id: 'proof-006',
    creator_id: 'creator-005',
    creator_name: 'Sofia Mendez',
    creator_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
    month: '2026-02',
    platform: 'TIKTOK',
    score: 21800,
    eligible: false, // strike during contest period
    disqualified: false,
    disqualification_reason: null,
  },
]

// ─────────────────────────────────────────────────────────────
// STRIKES
// ─────────────────────────────────────────────────────────────
export const DEMO_STRIKES: Strike[] = [
  {
    id: 'strike-001',
    creator_id: 'creator-002',
    reason: 'account_private',
    notes: 'Account was set to private when admin reviewed the submitted proof link.',
    admin_id: 'admin-001',
    created_at: daysAgo(21),
  },
]

// ─────────────────────────────────────────────────────────────
// HELPER LOOKUPS
// ─────────────────────────────────────────────────────────────

/** Get all menu items for a restaurant */
export function getMenuItemsForRestaurant(restaurantId: string): MenuItem[] {
  return DEMO_MENU_ITEMS.filter((item) => item.restaurant_id === restaurantId && item.active)
}

/** Get deliverable requirement for a restaurant */
export function getDeliverableForRestaurant(restaurantId: string): DeliverableRequirement | null {
  return DEMO_DELIVERABLE_REQUIREMENTS.find((d) => d.restaurant_id === restaurantId) ?? null
}

/** Get all orders for a creator */
export function getOrdersForCreator(creatorId: string): Order[] {
  return DEMO_ORDERS.filter((o) => o.creator_id === creatorId)
}

/** Get proof submission for an order */
export function getProofForOrder(orderId: string): ProofSubmission | null {
  return DEMO_PROOF_SUBMISSIONS.find((p) => p.order_id === orderId) ?? null
}

/** Get latest analytics snapshot for a proof */
export function getLatestSnapshot(proofId: string): AnalyticsSnapshot | null {
  const snaps = DEMO_ANALYTICS_SNAPSHOTS.filter((s) => s.proof_id === proofId)
  if (snaps.length === 0) return null
  return snaps.reduce((latest, s) => (s.timestamp > latest.timestamp ? s : latest))
}

/** Get sorted leaderboard for a given month */
export function getLeaderboard(month: string): ContestEntry[] {
  return DEMO_CONTEST_ENTRIES.filter((e) => e.month === month).sort(
    (a, b) => b.score - a.score
  )
}
