// src/pages/LandingPage.js
import React from "react";
import Navbar         from "../components/landing/Navbar";
import LandingContent from "../components/landing/LandingContent";
import Footer         from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />
      <LandingContent />
      <Footer />
    </div>
  );
}
