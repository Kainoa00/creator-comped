import type { Metadata } from 'next'
import Navbar from './_landing/Navbar'
import Hero from './_landing/Hero'
import Features from './_landing/Features'
import HowItWorks from './_landing/HowItWorks'
import SocialProof from './_landing/SocialProof'
import FAQ from './_landing/FAQ'
import CTABanner from './_landing/CTABanner'
import Resources from './_landing/Resources'
import Footer from './_landing/Footer'
import { SectionDivider } from './_landing/AnimatedSection'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://creatorcomped.com',
  },
}

export default function HomePage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-orange-500 focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Fixed gradient mesh background — replaces per-section blobs */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-orange-500/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px]" />
      </div>

      {/* Subtle noise texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <main id="main-content">
          <Hero />
          <SectionDivider />
          <Features />
          <HowItWorks />
          <SectionDivider />
          <SocialProof />
          <FAQ />
          <CTABanner />
          <Resources />
        </main>
        <Footer />
      </div>
    </div>
  )
}
