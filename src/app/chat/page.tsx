import CTASection from '@/components/landing/CTASection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import Footer from '@/components/landing/Footer'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import Navbar from '@/components/landing/Navbar'
import PricingSection from '@/components/landing/PricingSection'

const Page = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <PricingSection />
            <CTASection />
            <Footer />
        </div>
    )
}

export default Page
