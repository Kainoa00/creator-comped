import AnimatedSection from './AnimatedSection'

export default function CTABanner() {
  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 px-12 py-16 text-center">
            {/* Inner shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" aria-hidden="true" />

            {/* Decorative orbs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/[0.08] blur-2xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-white/[0.08] blur-2xl pointer-events-none" aria-hidden="true" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" aria-hidden="true" />
            {/* Small decorative circles */}
            <div className="absolute top-8 right-16 w-20 h-20 rounded-full border border-white/[0.15] pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-10 left-20 w-14 h-14 rounded-full border border-white/[0.1] pointer-events-none" aria-hidden="true" />
            <div className="absolute top-16 left-1/3 w-8 h-8 rounded-full bg-white/[0.06] pointer-events-none" aria-hidden="true" />

            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">Ready to get started?</h2>
              <p className="text-lg opacity-90 mb-10 max-w-xl mx-auto leading-relaxed">
                Join CreatorComped today and start connecting with your local food community.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#"
                  className="px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-base transition-all duration-300 hover:bg-white/95 hover:shadow-xl hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rose-500"
                >
                  Download the App
                </a>
                <a
                  href="#"
                  className="px-8 py-4 rounded-full border-2 border-white/50 text-white font-bold text-base transition-all duration-300 hover:bg-white/15 hover:border-white/70 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rose-500"
                >
                  Contact Sales
                </a>
              </div>
            </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
