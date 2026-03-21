# CreatorComped

Influencer marketing platform connecting content creators with restaurants for complimentary dining in exchange for social media content.

## What's in this repo

| Part | Location | Access |
|------|----------|--------|
| **Landing page** | `app/page.tsx` | `creatorcomped.com` |
| **Creator (influencer) app** | `app/creator/` | iOS app + `creatorcomped.com/creator` |
| **Restaurant dashboard** | `app/restaurant-admin/` | `creatorcomped.com/restaurant-admin` |
| **Internal admin** | `app/admin/` | `creatorcomped.com/admin` |
| **iOS native shell** | `ios/` | Capacitor WebView — loads live Vercel URL |
| **Android native shell** | `android/` | Capacitor WebView — loads live Vercel URL |

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (Postgres + Auth)
- **Mobile**: Capacitor (iOS + Android WebView wrapper)
- **Deployment**: Vercel

## Getting started

```bash
npm install
npm run dev
```

## iOS testing (Capacitor)

The app loads the live Vercel URL in a native WebView — no local web build needed.

```bash
npm install
npx cap sync ios
npx cap open ios    # opens Xcode
```

In Xcode: set your Apple Developer team under **Signing & Capabilities**, pick a simulator, then **Cmd+R**.

## Environment variables

```bash
cp .env.example .env.local
# fill in Supabase, Mapbox, and Sentry keys
```
