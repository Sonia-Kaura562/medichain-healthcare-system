// src/components/landing/CTASection.js
import React from "react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section id="cta" className="py-xl">
      {/* Platform Ecosystem */}
      <h2 className="font-headline-lg text-headline-lg text-center mb-xl">
        Platform Ecosystem
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
        <div className="space-y-md group">
          <div className="overflow-hidden rounded-xl border border-outline-variant/30 shadow-lg">
            <img
              className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzgnr71Wy4n6szRCmgJd0oRk0VtThXJvDCpOBSplZ5w0PgX8zxiT83zqC30ykQ9TxymNXftYvgyapgCFU5uSVPSyOs3NrS6-hDWn565Mhv74U1IDCGcE5SU2IPWE8FHfpgLDFAuxtL8tAJgpcdbW58inFuZKPGOj8YVdo2JI3WrDhkmMbE2Yd2DSOvTipPufkNSjgxZpsUpH594bQjpnFinwU4SM2axHfa2MGFs2vgBboxsj3ZRfcH_7WwTKConhGSPpuhWLZWQlU"
              alt="Patient Dashboard"
            />
          </div>
          <div className="px-xs">
            <h6 className="font-title-lg text-title-lg">Patient Dashboard</h6>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Comprehensive health monitoring and record management.
            </p>
          </div>
        </div>

        <div className="space-y-md group">
          <div className="overflow-hidden rounded-xl border border-outline-variant/30 shadow-lg">
            <img
              className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyca0Lo3n66tkYsbC0YvUx7twXQmkV074Ws_5xK87ELnN5N29rQRjJmdeQ96Fntp1zvUEKj8IfcQDXKvIVz8LRJbBTxrZHYBYN0ZMkMRVWE1yONB0aNH7wJz-gT0FiAZ2D3s7i_kMLhZIcEJb8U1tRVXkGWPLNJYSyME1_cBMA3aQzXHnlz1y0nNo1fjns8mdCAtXJPboaBvDjr0Ve3RQXdQ7oOQuCXx68Lucu2PEmhWV7FY1rdZLk0BnuV98SwCwHzZFuEjplwcI"
              alt="Doctor Console"
            />
          </div>
          <div className="px-xs">
            <h6 className="font-title-lg text-title-lg">Doctor Console</h6>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Advanced diagnostic tools and full patient history access.
            </p>
          </div>
        </div>

        <div className="space-y-md group">
          <div className="overflow-hidden rounded-xl border border-outline-variant/30 shadow-lg">
            <img
              className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGbcJwDgHkU21P4Jt7x-x-ToL7P2GE8hn4F59YSxgd7dXvmrf70H28xMWyOHA8JBAw8RcYV6nEQYaKyeTCZobjbCKirIwdWnCBQ6y6IVCmdLipV23ZNtlo8GbclVc48sZK_cQaHi0qQhkukCrGEHFreQpbyrhnShwWtcjd16dzUSiJf1do5RiYur2RvGS3A-BRa2POM0pjWCiWpAE24duq9L7OT7uCBAZNf9V4CeWjNGDGDI__-jAM0zaUZw07Lj1CotmcoS2TgmE"
              alt="Admin Network"
            />
          </div>
          <div className="px-xs">
            <h6 className="font-title-lg text-title-lg">Admin Network</h6>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Hospital-level node management and compliance monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-primary-container text-white rounded-3xl p-xl md:p-[80px] text-center space-y-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
              </pattern>
            </defs>
            <rect fill="url(#grid)" height="100%" width="100%"></rect>
          </svg>
        </div>

        <h2 className="font-display text-display max-w-[800px] mx-auto relative z-10">
          Take Control of Your Medical Journey Today
        </h2>
        <p className="font-body-lg text-body-lg max-w-[600px] mx-auto opacity-90 relative z-10">
          Built to help patients, doctors, and healthcare providers manage
          medical records with privacy and trust.
        </p>

        <div className="flex flex-wrap justify-center gap-md pt-md relative z-10">
          <Link
            to="/register"
            className="bg-white text-primary font-title-lg text-title-lg px-xl py-md rounded-xl hover:bg-surface transition-all shadow-xl w-full md:w-auto"
          >
            Create Free Account
          </Link>
          <Link
            to="/login"
            className="border-2 border-white text-white font-title-lg text-title-lg px-xl py-md rounded-xl hover:bg-white/10 transition-all w-full md:w-auto"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
