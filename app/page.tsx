import Navbar from './_landing/Navbar'
import Hero from './_landing/Hero'
import Features from './_landing/Features'
import HowItWorks from './_landing/HowItWorks'
import SocialProof from './_landing/SocialProof'
import FAQ from './_landing/FAQ'
import Resources from './_landing/Resources'
import CTABanner from './_landing/CTABanner'
import Footer from './_landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <SocialProof />
        <FAQ />
        <Resources />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
