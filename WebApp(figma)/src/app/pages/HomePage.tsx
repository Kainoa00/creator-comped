import { 
  MapPin, 
  ShoppingBag, 
  QrCode, 
  Link2, 
  Trophy, 
  BarChart3,
  ArrowRight,
  Check,
  Smartphone
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";

export function HomePage() {
  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get your food comped.
              <br />
              Create content.
              <br />
              Win rewards.
            </h1>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Creator Comped connects content creators with local restaurants. 
              Redeem complimentary meals, create authentic content, and compete 
              for monthly prizes while restaurants gain exposure.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold hover:opacity-90 transition text-lg">
                Download / Join as Creator
              </button>
              <button className="px-8 py-4 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition text-lg">
                Join as Restaurant
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761515397001-c8e82879c4c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwYXBwJTIwbW9ja3VwJTIwcmVzdGF1cmFudCUyMG1lbnV8ZW58MXx8fHwxNzcyMzYxNDc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Creator Comped App"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-xl text-white/70">
            Powerful features for creators and restaurants
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Discovery Map & List</h3>
            <p className="text-white/70 leading-relaxed">
              Find participating restaurants near you with an interactive map 
              and list view showing all available comps in your area.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Simple Ordering</h3>
            <p className="text-white/70 leading-relaxed">
              Select menu items within restaurant-defined limits. Clear pricing 
              and restrictions ensure transparency for both parties.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <QrCode className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">QR Code Redemption</h3>
            <p className="text-white/70 leading-relaxed">
              Redeem your comp instantly with a QR code scan at the restaurant. 
              Backup 5-digit codes ensure smooth redemption every time.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <Link2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Post Submission</h3>
            <p className="text-white/70 leading-relaxed">
              Submit your Instagram and TikTok post links for verification. 
              Track your content performance and deliverable compliance.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Monthly Leaderboard</h3>
            <p className="text-white/70 leading-relaxed">
              Compete with other creators for monthly prizes. Top performers 
              earn rewards based on engagement and content quality.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Business Analytics</h3>
            <p className="text-white/70 leading-relaxed">
              Restaurants track spend, monitor comp usage, analyze creator 
              performance, and measure ROI with comprehensive dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How it works</h2>
          <p className="text-xl text-white/70">
            Simple process for creators and restaurants
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Creators */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">For Creators</h3>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Choose a restaurant</h4>
                  <p className="text-white/70">
                    Browse the map or list to find participating restaurants near you
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Select menu items</h4>
                  <p className="text-white/70">
                    Choose items within the restaurant's defined limits and restrictions
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Get comped via QR code</h4>
                  <p className="text-white/70">
                    Show your QR code at the restaurant to redeem your complimentary meal
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Submit post links</h4>
                  <p className="text-white/70">
                    Share your Instagram and TikTok posts to complete the comp
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* For Restaurants */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">For Restaurants</h3>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Set menu + limits</h4>
                  <p className="text-white/70">
                    Upload your menu, set pricing, and define per-item and category limits
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Set deliverables</h4>
                  <p className="text-white/70">
                    Define content requirements, hashtags, and posting guidelines
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Employees scan QR</h4>
                  <p className="text-white/70">
                    Staff quickly validate and redeem comps with built-in QR scanner
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Track spend + analytics</h4>
                  <p className="text-white/70">
                    Monitor your investment, creator performance, and content reach
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="bg-gradient-to-br from-orange-500/10 to-blue-600/10 backdrop-blur-sm rounded-3xl p-16 text-center border border-white/5">
          <h2 className="text-3xl font-bold mb-4">Trusted by local restaurants</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join hundreds of restaurants and thousands of creators already using 
            Creator Comped to drive authentic engagement and build community.
          </p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-50">
            <div className="text-2xl font-semibold">Restaurant Logo</div>
            <div className="text-2xl font-semibold">Restaurant Logo</div>
            <div className="text-2xl font-semibold">Restaurant Logo</div>
            <div className="text-2xl font-semibold">Restaurant Logo</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-semibold mb-3">How do I become a creator?</h3>
            <p className="text-white/70 leading-relaxed">
              Download the Creator Comped app, create an account with your Instagram 
              and TikTok profiles, and start browsing participating restaurants immediately.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-semibold mb-3">How do restaurants benefit?</h3>
            <p className="text-white/70 leading-relaxed">
              Restaurants gain authentic content, increased social media exposure, 
              and detailed analytics tracking ROI—all while controlling their budget 
              and comp limits.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-semibold mb-3">What are the posting requirements?</h3>
            <p className="text-white/70 leading-relaxed">
              Each restaurant sets their own deliverables. Typically, creators must 
              post within 48 hours and include specified hashtags and restaurant tags.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-semibold mb-3">How does the leaderboard work?</h3>
            <p className="text-white/70 leading-relaxed">
              Creators earn points based on engagement (views, likes, comments) across 
              their Instagram and TikTok posts. Top performers each month win prizes 
              from the prize pool.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-3xl p-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join Creator Comped today and start connecting with your local 
            food community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition text-lg">
              Download the App
            </button>
            <button className="px-8 py-4 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition text-lg backdrop-blur-sm">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="max-w-[1440px] mx-auto px-8 py-24 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Resources</h2>
          <p className="text-xl text-white/70">
            Everything you need to know about Creator Comped
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <a
            href="#"
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition text-center"
          >
            <h3 className="font-semibold mb-2">Rules</h3>
            <p className="text-white/70 text-sm">
              Platform guidelines and policies
            </p>
          </a>
          <a
            href="#"
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition text-center"
          >
            <h3 className="font-semibold mb-2">Support</h3>
            <p className="text-white/70 text-sm">
              Get help from our team
            </p>
          </a>
          <a
            href="#"
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition text-center"
          >
            <h3 className="font-semibold mb-2">Terms of Service</h3>
            <p className="text-white/70 text-sm">
              Legal terms and conditions
            </p>
          </a>
          <a
            href="#"
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition text-center"
          >
            <h3 className="font-semibold mb-2">Privacy Policy</h3>
            <p className="text-white/70 text-sm">
              How we protect your data
            </p>
          </a>
        </div>

        <div className="text-center">
          <Link
            to="/internal-admin/login"
            className="inline-block text-white/50 hover:text-white transition text-sm"
          >
            Admin Dashboard →
          </Link>
        </div>
      </section>
    </div>
  );
}