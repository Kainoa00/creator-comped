# HIVE — App Store Metadata

Ready to copy-paste into App Store Connect when submitting.

---

## App Information

| Field | Value |
|-------|-------|
| **App Name** | HIVE |
| **Bundle ID** | com.creatorcomped.app |
| **SKU** | HIVE-001 |
| **Primary Category** | Food & Drink |
| **Secondary Category** | Lifestyle |
| **Content Rating** | 4+ |
| **Version** | 1.0 |
| **Build** | 1 |

---

## Localizations (English — U.S.)

### Subtitle (30 chars max)
```
Creating Local Buzz
```

### Description (4000 chars max)
```
HIVE connects food creators with restaurants that want authentic content.

Browse restaurants in your city, claim a free meal comp, enjoy your experience, and post proof — it's that simple.

HOW IT WORKS:
• Discover — Browse local restaurants offering comps for content creators
• Claim — Redeem a comp directly from your phone with a QR code
• Create — Enjoy your meal and capture authentic content
• Proof — Submit your post link and get verified

FOR CREATORS:
Stop paying for meals you photograph anyway. HIVE connects you with restaurants that want real, unsponsored-feeling content from real creators. No complicated contracts, no minimum follower requirements — just show up, enjoy, and post.

FOR FREE:
HIVE is completely free for creators. No subscription, no fees.

WHAT YOU GET:
• Access to exclusive restaurant comps in your city
• One-tap QR code redemption at the restaurant
• Order history and comp tracking in your profile
• Proof submission tracking so you never miss a deliverable

PRIVACY FIRST:
HIVE only uses your location to show nearby restaurants. We collect your email and name to manage your account. We never sell your data or share it with advertisers.

Start eating for free today. Download HIVE.
```

### Keywords (100 chars max, comma-separated)
```
food,creator,comped,restaurant,influencer,free meals,content,foodie,dining,QR code
```

### Promotional Text (170 chars max — can be updated without new build)
```
Now live in your city. Browse local restaurants offering free comps for content creators. Download and start earning free meals today.
```

### Support URL
```
https://creatorcomped.com/support
```

### Marketing URL
```
https://creatorcomped.com
```

### Privacy Policy URL
```
https://creatorcomped.com/privacy
```

---

## App Review Information

### Sign-In Required
- **Yes** — Reviewers need a test account
- **Username**: testreviewer@creatorcomped.com
- **Password**: [create a test account before submission]

### Demo Notes for App Review
```
HIVE is a platform for food content creators to discover and claim restaurant comps.

TEST FLOW:
1. Sign up with the test credentials above (or use the provided test account)
2. On the Discover tab, browse available restaurant listings
3. Tap a restaurant to view its comp offer and deliverable requirements
4. The Cart tab shows claimed comps pending redemption
5. The Profile tab shows order history and submitted proof links

PUSH NOTIFICATIONS: The app requests push notification permission for order status updates. This can be declined during review — core functionality works without it.

CAMERA: Used for QR code scanning at restaurant check-in. Location is used to show nearby restaurants on the map view.

NOTE: This is v1.0. Some restaurant listings may be demo data during initial review.
```

---

## Screenshots Required

Apple requires screenshots for:
- **6.7" iPhone** (iPhone 15 Pro Max) — required, 1290×2796 px
- **6.5" iPhone** (iPhone 11 Pro Max) — required if supporting iOS 14+, 1242×2688 px
- **iPad Pro 12.9"** — required if supporting iPad, 2048×2732 px

### Suggested Screens to Capture (in order)
1. Discover tab — restaurant list with location/distance
2. Restaurant detail — comp offer, menu items, deliverable requirements
3. Cart / Redeem — QR code redemption screen
4. Proof submission — post link entry screen
5. Profile — order history

---

## Age Rating Questionnaire

All answers: **No**
- No unrestricted web access
- No user-generated content (proof links are moderated)
- No gambling
- No mature/suggestive themes
- No medical advice

**Final rating: 4+**

---

## What to Do Before Submission

### Code/Config (all done ✅)
- [x] `aps-environment: production` in entitlements
- [x] `ITSAppUsesNonExemptEncryption: false` in Info.plist
- [x] Privacy strings for Camera, Photos, Location
- [x] PrivacyInfo.xcprivacy with API usage reasons
- [x] Code signing set to Automatic with "Apple Development"
- [x] OAuth buttons hidden (non-functional UI removed)

### You Need to Do (manual steps)
- [x] Enroll in Apple Developer Program ($99/year): developer.apple.com/enroll
- [x] After approval (~24-48h): open Xcode → set Team in Signing & Capabilities
- [ ] Create app in App Store Connect → New App → enter metadata above
- [ ] Register bundle ID `com.creatorcomped.app` (Xcode can auto-register with Automatic signing)
- [ ] Take App Store screenshots on a real device or Simulator (see list above)
- [ ] Create test reviewer account at creatorcomped.com
- [ ] Add support/privacy pages at creatorcomped.com (can be simple HTML pages)
- [ ] Archive in Xcode: Product → Archive → Distribute App → App Store Connect
- [ ] Submit for review in App Store Connect

### Vercel Web Deployment
- [ ] Push this branch to main → Vercel auto-deploys
- [ ] Verify env vars are set in Vercel dashboard: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SENTRY_AUTH_TOKEN (if using Sentry)
- [ ] Visit creatorcomped.com after deploy and verify the site loads
