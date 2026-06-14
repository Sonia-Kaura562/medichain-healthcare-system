// src/components/landing/Footer.js
import React from "react";

export default function Footer() {

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
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 mt-xl">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-xl py-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-xl mb-xl">

          {/* Brand */}
          <div className="col-span-2 space-y-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-2xl">health_and_safety</span>
              <span className="font-bold text-on-surface text-lg">MediChain</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[300px]">
              Reinventing healthcare data infrastructure with clinical-grade
              privacy and patient-first access control.
            </p>
            <div className="flex gap-md">
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">forum</span>
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-md">
            <h6 className="font-title-lg text-title-lg text-on-surface">Product</h6>
            <ul className="space-y-sm font-body-md text-body-md text-on-surface-variant">
              <li><button className="hover:text-primary transition-colors" onClick={() => scrollToSection("gpid")}>What is GPID?</button></li>
              <li><button className="hover:text-primary transition-colors" onClick={() => scrollToSection("patient-portal")}>Patient Portal</button></li>
              <li><button className="hover:text-primary transition-colors" onClick={() => scrollToSection("doctor-portal")}>Doctor Portal</button></li>
              <li><button className="hover:text-primary transition-colors" onClick={() => scrollToSection("admin-portal")}>Admin Portal</button></li>
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-md">
            <h6 className="font-title-lg text-title-lg text-on-surface">Security</h6>
            <ul className="space-y-sm font-body-md text-body-md text-on-surface-variant">
              <li><button className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToSection("security")}>Privacy &amp; Security</button></li>
              <li><button className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToSection("security")}>IPFS Storage</button></li>
              <li><button className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToSection("security")}>Blockchain Audit Trail</button></li>
              <li><button className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToSection("security")}>Access Control</button></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-md">
            <h6 className="font-title-lg text-title-lg text-on-surface">Support</h6>
            <ul className="space-y-sm font-body-md text-body-md text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contact Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-md">
            <h6 className="font-title-lg text-title-lg text-on-surface">Legal</h6>
            <ul className="space-y-sm font-body-md text-body-md text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-lg border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-md">
          <p className="font-body-md text-body-md text-on-surface-variant">
            © 2026 MediChain Ledger. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
