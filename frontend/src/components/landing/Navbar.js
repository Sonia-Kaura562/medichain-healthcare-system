// src/components/landing/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {

  const scrollToSection = (id) => {

    const element = document.getElementById(id);

    if (element) {

      const navbarHeight = 70;

      const y =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };
  return (
    <nav className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-lg py-md">
      <div className="flex items-center gap-sm">
        <span
          className="material-symbols-outlined text-[#00677D]"
          style={{
            fontVariationSettings: '"FILL" 1',
            fontSize: "24px",
          }}
        >
          health_and_safety
        </span>
        <span
          style={{
            fontFamily: "Geist, sans-serif",
            fontSize: "20px",
            lineHeight: "28px",
            fontWeight: 700,
            color: "#00677D",
          }}
        >MediChain</span>
      </div>

      <div className="hidden md:flex gap-xl font-label-md text-label-md text-on-surface-variant">
        <button className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToSection("features")}>Portal Features</button>
        <button className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToSection("security")}>Security</button>
        <button className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToSection("solutions")}>Healthcare Challenges</button>
      </div>

      <div className="flex items-center gap-md">
        <Link
          to="/login"
          className="font-label-md text-label-md text-on-surface hover:text-primary transition-colors px-md py-sm"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="bg-primary hover:bg-primary-container text-white font-label-md text-label-md px-lg py-sm rounded-full transition-all active:scale-95 shadow-sm"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
