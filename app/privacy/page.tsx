import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — HIVE',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: March 19, 2026</p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We collect information you provide when creating an account, including your name, email address,
            Instagram handle, and TikTok handle. When you redeem a comp at a restaurant, we record the
            transaction details including the restaurant, items ordered, and timestamp. We collect proof of
            posting (post URLs or screenshots) when you submit content deliverables.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We use your information to operate the HIVE platform, verify your identity as a creator,
            process comp redemptions at partner restaurants, track your posting deliverables, and calculate
            your standing on the monthly leaderboard. We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">3. Content Usage Rights</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            By participating in HIVE, you grant partner restaurants a non-exclusive, royalty-free
            license to repost your publicly published content (Instagram Reels, TikTok videos) on their
            official social media channels, provided they credit you as the creator. This right may be
            toggled off per restaurant based on their deliverables settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">4. Data Sharing</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We share your name, social handles, and post links with partner restaurants when you redeem a
            comp at their location. This is necessary for them to verify your visit and content. Restaurant
            partners are prohibited from using your information for purposes outside the HIVE program.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">5. Data Storage</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Your data is stored securely using Supabase, hosted in the United States. We use industry-standard
            encryption in transit (TLS) and at rest. We retain your account data for as long as your account
            is active. You may request deletion of your account by contacting support@hive.app.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">6. Push Notifications</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            If you grant permission, we send push notifications for comp approvals, proof submission
            confirmations, and leaderboard updates. You can disable notifications at any time in your
            device settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">7. Camera Access</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The HIVE app requests camera access solely to scan QR codes at partner restaurants
            during the comp redemption process. We do not capture, store, or transmit photos or video
            through this permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">8. Children&apos;s Privacy</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            HIVE is not directed at children under the age of 13. We do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">9. Contact</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            For privacy inquiries or to request account deletion, contact us at{' '}
            <a href="mailto:support@hive.app" className="text-orange-400">
              support@hive.app
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
