import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support — HIVE',
}

export default function PublicSupportPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Support</h1>
        <p className="text-white/40 text-sm mb-10">
          Need help? We&apos;re here for you.
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-2">
            For any questions, issues, or feedback, reach out to our support team:
          </p>
          <a
            href="mailto:kaishintaku08@gmail.com"
            className="inline-block text-orange-400 font-semibold text-sm hover:underline"
          >
            kaishintaku08@gmail.com
          </a>
          <p className="text-white/40 text-xs mt-2">
            We typically respond within 24 hours on business days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-1">How do I get comped?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Browse available restaurants in the Discover tab, add menu items to your cart,
                and place a comp order. You&apos;ll receive a QR code to show at the restaurant.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1">What are the posting requirements?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Each restaurant sets their own deliverable requirements (e.g., an Instagram Reel
                or TikTok video). You&apos;ll see these before placing your order. You have 48 hours
                after your visit to submit proof of posting.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1">What happens if I don&apos;t post?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Failing to submit proof within 48 hours results in a strike. Three strikes lead
                to account suspension.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1">How do I delete my account?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Contact us at kaishintaku08@gmail.com with your registered email and we&apos;ll process
                your account deletion request within 48 hours.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Bug Reports</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Found a bug? Please email us at{' '}
            <a href="mailto:kaishintaku08@gmail.com" className="text-orange-400">
              kaishintaku08@gmail.com
            </a>{' '}
            with a description of the issue and any screenshots. Include your device model and
            iOS version to help us investigate faster.
          </p>
        </section>
      </div>
    </div>
  )
}
