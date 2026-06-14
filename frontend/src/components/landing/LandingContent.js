// src/components/landing/LandingContent.js
import React from "react";
import HeroSection    from "./HeroSection";
import ProblemSection from "./ProblemSection";
import GPIDSection    from "./GPIDSection";
import PortalSection  from "./PortalSection";
import SecuritySection from "./SecuritySection";
import CTASection     from "./CTASection";

export default function LandingContent() {
  return (
    <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-xl">
      <HeroSection />
      <ProblemSection />
      <GPIDSection />
      <PortalSection />
      <SecuritySection />
      <CTASection />
    </main>
  );
}
