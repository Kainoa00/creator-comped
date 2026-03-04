import { HelpCircle, Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react'

export default function SupportPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Support</h1>
        <p className="text-white/70">Get help and contact our team</p>
      </div>

      <div className="max-w-4xl">
        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a
            href="mailto:support@creatorcomped.com"
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-white/70 text-sm mb-3">Get help via email within 24 hours</p>
            <div className="flex items-center gap-2 text-orange-500 group-hover:text-orange-400">
              <span className="text-sm">support@creatorcomped.com</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          <a
            href="tel:+15551234567"
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-white/70 text-sm mb-3">Call us Monday-Friday 9am-5pm PST</p>
            <div className="flex items-center gap-2 text-orange-500 group-hover:text-orange-400">
              <span className="text-sm">(555) 123-4567</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          <button className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition group text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-white/70 text-sm mb-3">Chat with our support team instantly</p>
            <div className="flex items-center gap-2 text-orange-500 group-hover:text-orange-400">
              <span className="text-sm">Start chat</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'How do I update my menu?',
                a: 'Navigate to the "Edit Menu" page from the sidebar. You can add categories, items, set prices, and define per-item and category limits. Changes are saved when you click "Save Changes" at the bottom of the page.',
              },
              {
                q: 'How do I track my budget?',
                a: 'Your monthly budget is displayed on the Dashboard page. You can view spend over time, top creators, and detailed analytics on the "Spend" page. Set your monthly budget limit in the Dashboard settings.',
              },
              {
                q: "What happens if a creator doesn't post?",
                a: 'Creators have 48 hours to post their content after redemption. If they fail to post within the deadline, the comp will be marked as "expired" and the creator may face account restrictions. This helps ensure accountability.',
              },
              {
                q: 'How do I change my restaurant name or email?',
                a: 'Restaurant name, phone, email, and website are locked fields for security. To update these, contact our support team at support@creatorcomped.com or call (555) 123-4567.',
              },
              {
                q: 'Can I adjust the creator cooldown period?',
                a: 'Yes! The creator cooldown setting is chain-wide and can be adjusted from the Dashboard page. This controls how many days must pass before the same creator can redeem another comp at any of your locations.',
              },
              {
                q: 'How is creator performance calculated?',
                a: 'Analytics tracks views, likes, and comments from Instagram and TikTok posts. We use advanced anti-bot detection to filter fake engagement and ensure accurate metrics. Top performers are ranked by combined engagement across both platforms.',
              },
            ].map((item, i) => (
              <div key={i} className={i > 0 ? 'border-t border-white/5 pt-6' : ''}>
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Links */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Additional Resources</h3>
          <div className="space-y-3">
            {['Platform Rules & Guidelines', 'Restaurant Best Practices', 'Content Quality Standards', 'Analytics Guide'].map(
              (resource) => (
                <a
                  key={resource}
                  href="#"
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  <span>{resource}</span>
                  <ExternalLink className="w-4 h-4 text-white/50" />
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
