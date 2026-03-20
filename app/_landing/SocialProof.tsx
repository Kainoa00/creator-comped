import AnimatedSection from './AnimatedSection'

const logos = ['Crumbl Cookies', 'Slab Pizza', 'Communal', 'Kneaders', 'The Habit', 'R&R BBQ', 'Cupbop', 'Pretty Bird']

function LogoPill({ name }: { name: string }) {
  return (
    <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm font-semibold text-white/55 tracking-tight shrink-0 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500/25 via-rose-500/15 to-blue-600/25 border border-white/[0.08] shrink-0 flex items-center justify-center" aria-hidden="true">
        <span className="text-[10px] font-bold text-white/40">{name[0]}</span>
      </div>
      {name}
    </div>
  )
}

export default function SocialProof() {
  // Duplicate for seamless loop
  const doubled = [...logos, ...logos]

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32" aria-label="Trusted partners">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-orange-500/[0.07] via-transparent to-blue-600/[0.07] p-12 text-center">
          {/* Gradient blobs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">Trusted by local restaurants</h2>
            <p className="text-white/55 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Join hundreds of restaurants and thousands of creators already
              building authentic community with CreatorComped.
            </p>

            {/* Marquee container with edge fade */}
            <div
              className="overflow-hidden"
              style={{
                maskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
              }}
            >
              {/* Row 1 — scrolls left */}
              <div className="flex gap-4 mb-4" style={{ width: 'max-content', animation: 'marquee 25s linear infinite' }}>
                {doubled.map((name, i) => (
                  <LogoPill key={`r1-${i}`} name={name} />
                ))}
              </div>

              {/* Row 2 — scrolls right (reverse) */}
              <div className="flex gap-4" style={{ width: 'max-content', animation: 'marquee-reverse 30s linear infinite' }}>
                {[...doubled].reverse().map((name, i) => (
                  <LogoPill key={`r2-${i}`} name={name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
