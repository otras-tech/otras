import Navbar from "../LandingPage/components/Navbar";
import Hero from "../LandingPage/components/Hero";
import Features from "../LandingPage/components/Features";
import HowItWorks from "../LandingPage/components/HowItWorks";
import Opportunities from "../LandingPage/components/Opportunities";
import AISection from "../LandingPage/components/AISection";
import Benefits from "../LandingPage/components/Benefits";
import Testimonials from "../LandingPage/components/Testimonials";
import CTA from "../LandingPage/components/CTA";
import Footer from "../LandingPage/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Opportunities />
      <AISection />
      <Benefits />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}