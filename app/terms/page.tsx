import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — CreatorComped',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: March 19, 2026</p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            By creating an account on CreatorComped, you agree to these Terms of Service. If you do not
            agree, you may not use the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">2. Creator Eligibility</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            CreatorComped is an invite-only platform. Creators must be approved through our vetting process
            before accessing comps. Approval requires verified social media accounts and compliance with
            our content standards. We reserve the right to revoke access at any time for violations of
            these terms or platform policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">3. Content Deliverables</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            In exchange for a complimentary meal, creators agree to post authentic content (Instagram Reel
            and/or TikTok video) within 48 hours of their visit. Posts must include required hashtags and
            restaurant tags as specified on the restaurant's deliverables page. Content must not include
            misleading claims, discriminatory material, or content that violates the social media platform's
            terms of service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">4. Prohibited Content</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The following content is strictly prohibited in posts made through CreatorComped: political
            content, religious content, discriminatory or hateful language, explicit or adult content,
            false claims about the restaurant or its food, and sponsored disclosures that misrepresent the
            nature of the relationship.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">5. Strike System</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Violations of these terms may result in strikes on your account. Three strikes result in
            permanent removal from the platform. Strike-worthy offenses include: failing to post within
            48 hours of a comp, posting content that violates Section 4, misrepresenting your visit,
            and attempting to manipulate the leaderboard.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">6. Comp Redemption</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Each creator may hold one active comp at a time. Comp codes expire 20 minutes after generation.
            Comps are subject to each restaurant's daily cap, blackout hours, and cooldown periods. A comp
            covers the items specified in the approved cart only — additional charges are the creator's
            responsibility.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">7. Restaurant Partner Terms</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Restaurants agree to honor approved comp orders presented by verified creators. Restaurants may
            set their own comp rules (daily caps, blackout hours, required items) within platform limits.
            Restaurants may not discriminate against creators based on protected characteristics.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">8. Leaderboard & Prizes</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Monthly leaderboard prizes are awarded at CreatorComped's sole discretion. Prize amounts and
            structure may change month to month. Leaderboard scores are calculated based on verified posts,
            engagement metrics, and platform activity as defined in our scoring documentation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">9. Limitation of Liability</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            CreatorComped is provided "as is" without warranty of any kind. We are not liable for any
            indirect, incidental, or consequential damages arising from your use of the platform, including
            disputes between creators and restaurants.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">10. Changes to Terms</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We may update these terms at any time. Continued use of CreatorComped after changes constitutes
            acceptance of the updated terms. Material changes will be communicated via email.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">11. Contact</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Questions about these terms? Contact us at{' '}
            <a href="mailto:support@creatorcomped.com" className="text-orange-400">
              support@creatorcomped.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
