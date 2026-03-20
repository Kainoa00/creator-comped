# TODOS

Deferred work captured from engineering and CEO reviews. Pick up any of these as sprint 2+ items.

---

## T1 — Realtime feed reconnection indicator

**What:** Surface a "Reconnecting..." state when the Supabase realtime channel for `useRealtimeOrders` drops.

**Why:** If WiFi at a restaurant is spotty, the scanner page shows stale order data with no visual indicator. Staff could miss a comp or double-confirm.

**How to apply:** Supabase channels emit a `status` callback with `'CHANNEL_ERROR'` or `'CLOSED'`. Listen for it and set a `connected: boolean` flag on the hook. Show a yellow banner on the scanner page when `!connected`.

**Context:** `lib/hooks/useRealtimeOrders.ts` — the `.subscribe()` callback receives a `status` param. Add: `if (status === 'CHANNEL_ERROR') setConnected(false)`.

**Effort:** ~30 min CC
**Depends on:** PR 1 (realtime hook updated)

---

## T2 — Order list pagination in useOrders

**What:** Add a row limit (then proper cursor pagination) to `useOrders` in `lib/hooks/useRestaurantData.ts`.

**Why:** Currently fetches all orders unbounded. At scale (100+ restaurants × many months of data), this returns too many rows.

**How to apply:** As a first pass, add `.limit(100)` to the Supabase query. For proper pagination, add `page: number` param and use `.range(page * 50, (page + 1) * 50 - 1)`.

**Context:** `lib/hooks/useRestaurantData.ts`, `useOrders` function. Add `.limit(100)` immediately before `.then(...)`.

**Effort:** 1-line now / ~1 hr for proper infinite scroll
**Depends on:** Live launch (need real volume to know right page size)

---

## T3 — Admin panel route protection (/admin/*)

**What:** Gate all `/admin/*` pages behind an auth check that requires `role === 'admin'`.

**Why:** The admin panel (creator vetting, strike management, restaurant management) is currently accessible to anyone who knows the URL. This is a security gap once real data is in Supabase.

**How to apply:** Add an auth check in `app/admin/layout.tsx` using `useRestaurantAuth()`. If `user.role !== 'admin'`, redirect to `/`. Alternatively use Next.js middleware (`middleware.ts`) for a server-side check.

**Context:** `app/admin/layout.tsx` exists. Role is now correctly populated from `restaurant_users` (Issue 7A fix in PR 1). Platform admin users need `role = 'admin'` in the `restaurant_users` table.

**Effort:** ~15 min CC
**Priority:** High — ship in early sprint 2 before onboarding more than 1-2 restaurants
**Depends on:** PR 1 (role fix from Issue 7A)

---

## T4 — Branded transactional email templates (PR 2 follow-up)

**What:** Replace Supabase default magic-link email with CreatorComped-branded templates. Add comp confirmation + proof accepted emails via Resend.

**Why:** Default Supabase emails look generic. Branded emails are part of the "real product" feeling for first-time creators.

**Context:** PR 2 adds Resend. Templates go in `lib/email/` and are triggered from API routes on order status changes.

**Effort:** ~1 hr CC
**Depends on:** PR 2 (Resend setup)
