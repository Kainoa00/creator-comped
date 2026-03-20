// ============================================================
// CreatorComped — Shared TypeScript Types
// ============================================================

export type UserRole = 'creator' | 'restaurant_staff' | 'restaurant_manager' | 'admin'

// ── Creator ──────────────────────────────────────────────────
export interface Creator {
  id: string
  name: string
  photo_url: string | null
  email: string
  phone: string | null
  ig_handle: string | null
  tiktok_handle: string | null
  verified: boolean
  invite_code: string | null
  strike_count: number
  ban_state: 'none' | 'temporary' | 'permanent'
  ban_until: string | null
  geo_market: 'utah_county' | 'slc_county'
  created_at: string
}

// ── Restaurant ───────────────────────────────────────────────
export interface DayHours {
  open: string   // "HH:MM" 24h
  close: string  // "HH:MM" 24h
  closed: boolean
}

export type RestaurantHours = Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', DayHours>

export interface RestaurantSettings {
  daily_comp_cap: number | null
  blackout_start: string | null  // "HH:MM"
  blackout_end: string | null    // "HH:MM"
  cooldown_days: number
  max_items_per_order: number
  pause_comps: boolean
}

export interface Restaurant {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  hours: RestaurantHours
  manager_pin: string
  settings: RestaurantSettings
  active: boolean
  created_at: string
}

// ── Menu Item ─────────────────────────────────────────────────
export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  image_url: string | null
  max_qty_per_order: number
  estimated_cogs: number | null
  active: boolean
  created_at: string
}

// ── Deliverable Requirement ───────────────────────────────────
export type DeliverableType = 'IG_REEL' | 'TIKTOK' | 'BOTH' | 'CHOICE'

export interface DeliverableRequirement {
  id: string
  restaurant_id: string
  allowed_types: DeliverableType
  required_hashtags: string[]
  required_tags: string[]
}

// ── Order ─────────────────────────────────────────────────────
export type OrderStatus =
  | 'created'
  | 'scanned'
  | 'confirmed'
  | 'proof_submitted'
  | 'approved'
  | 'rejected'
  | 'expired'

export interface OrderItem {
  menu_item_id: string
  menu_item_name: string
  qty: number
}

export interface Order {
  id: string
  creator_id: string
  restaurant_id: string
  restaurant_name: string
  items: OrderItem[]
  status: OrderStatus
  redemption_code: string  // 5-digit string
  qr_token: string
  expires_at: string
  created_at: string
  confirmed_at: string | null
  rejection_reason: string | null
  deliverable_requirement: DeliverableRequirement | null
}

// ── Proof Submission ──────────────────────────────────────────
export type ProofPlatform = 'IG_REEL' | 'TIKTOK'
export type ProofReviewStatus = 'pending' | 'approved' | 'needs_fix' | 'rejected'

export interface ProofSubmission {
  id: string
  order_id: string
  creator_id: string
  platform: ProofPlatform
  url: string
  screenshot_url: string | null
  submitted_at: string
  review_status: ProofReviewStatus
  reviewer_notes: string | null
  deadline: string  // ISO timestamp — 48h after order confirmed_at
}

// ── Analytics ─────────────────────────────────────────────────
export interface AnalyticsSnapshot {
  id: string
  proof_id: string
  timestamp: string
  views: number
  likes: number
  comments: number
  shares: number
  score: number  // Views + (Likes×5) + (Comments×25)
}

// ── Contest ───────────────────────────────────────────────────
export interface ContestEntry {
  id: string
  proof_id: string
  creator_id: string
  creator_name: string
  creator_photo: string | null
  month: string  // "YYYY-MM"
  platform: ProofPlatform
  score: number
  eligible: boolean
  disqualified: boolean
  disqualification_reason: string | null
}

// ── Strike ────────────────────────────────────────────────────
export type StrikeReason =
  | 'missed_deadline'
  | 'invalid_url'
  | 'account_private'
  | 'post_removed'
  | 'content_violation'
  | 'engagement_fraud'
  | 'other'

export interface Strike {
  id: string
  creator_id: string
  reason: StrikeReason
  notes: string | null
  admin_id: string
  created_at: string
}

// ── Cart (client-side only) ───────────────────────────────────
export interface CartItem {
  menu_item: MenuItem
  qty: number
}

// ── API Response helpers ──────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// ── Leaderboard ───────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number
  creator_id: string
  creator_name: string
  creator_photo: string | null
  ig_handle: string | null
  tiktok_handle: string | null
  score: number
  platform: ProofPlatform
  month: string
  eligible: boolean
}

// ── Vetting / Invite ──────────────────────────────────────────
export interface InviteApplication {
  id: string
  name: string
  email: string
  ig_handle: string | null
  tiktok_handle: string | null
  follower_count: number | null
  why_join: string | null
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  reviewed_at: string | null
  reviewer_notes: string | null
}

// ── Notification (client-side) ────────────────────────────────
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// ── Restaurant User ───────────────────────────────────────────
export type RestaurantUserRole = 'staff' | 'manager' | 'admin'

export interface RestaurantUser {
  id: string
  auth_user_id: string | null
  restaurant_id: string
  role: RestaurantUserRole
  name: string
  email: string | null
  pin: string | null
  created_at: string
}

// ── Extended Restaurant (new columns) ─────────────────────────
export interface RestaurantProfile extends Restaurant {
  logo_url: string | null
  description: string | null
  phone: string | null
  website: string | null
  ig_handle: string | null
  tiktok_handle: string | null
  monthly_budget: number | null
}
