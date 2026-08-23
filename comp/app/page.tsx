import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { Testimonials } from "@/components/landing/testimonials"
import { Footer } from "@/components/landing/footer"
import { FloatingAIButton } from "@/components/landing/floating-ai-button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <Testimonials />
      <Footer />
      <FloatingAIButton />
    </main>
  )
}
