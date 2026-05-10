import React from "react";
import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { AppPreview } from "../components/landing/AppPreview";
import { Features } from "../components/landing/Features";
import { CTASection } from "../components/landing/CTASection";
import { Footer } from "../components/landing/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <AppPreview />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
