import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Support — HIVE',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Support</h1>
        <p className="text-white/40 text-sm mb-10">We&apos;re here to help you get the most out of HIVE.</p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            For any questions, issues, or feedback, reach out to our support team at{' '}
            <a href="mailto:support@hive.app" className="text-orange-400 hover:underline">
              support@hive.app
            </a>. We typically respond within 24 hours.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">For Creators</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-1">How do I redeem a comp?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Browse available restaurants on the Discover page, add a comp to your cart, and present
                the QR code at the restaurant. The restaurant will scan your code to confirm the redemption.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-1">What are deliverables?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                After redeeming a comp, you&apos;re expected to post content (Instagram Reel, TikTok, etc.)
                about the restaurant within the timeframe specified. Submit your post link as proof through the app.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-1">What happens if I miss a deliverable?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Missing deliverables results in strikes on your account. Accumulating too many strikes may
                limit your ability to redeem future comps. Check the Rules page for full details.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-1">How does the leaderboard work?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                The monthly leaderboard ranks creators based on completed deliverables, content quality, and
                engagement. Top creators unlock additional perks and priority access to premium comps.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">For Restaurants</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-1">How do I set up my restaurant?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Sign up as a business, add your menu items and comp offerings, and configure your deliverable
                requirements. Creators will discover your restaurant and start redeeming comps.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-1">How do I verify a creator&apos;s visit?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Use the built-in QR scanner in the HIVE dashboard to scan the creator&apos;s redemption code.
                The system automatically records the visit and triggers the deliverable timeline.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-1">How do I track content performance?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Your business dashboard includes analytics showing all creator visits, submitted content,
                and engagement metrics. You can also view and approve proof-of-post submissions.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Account & Privacy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-1">How do I delete my account?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                To request account deletion, email{' '}
                <a href="mailto:support@hive.app" className="text-orange-400 hover:underline">
                  support@hive.app
                </a>{' '}
                with the subject line &ldquo;Account Deletion Request.&rdquo; We will process your request
                and remove your data within 30 days.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-1">Where can I find your privacy policy?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Our full privacy policy is available at the{' '}
                <Link href="/privacy" className="text-orange-400 hover:underline">
                  Privacy Policy
                </Link>{' '}
                page.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
