// src/components/landing/HeroSection.js
import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="py-xl md:py-[80px] flex flex-col md:flex-row items-center gap-xl bg-medical-gradient">
      <div className="flex-1 space-y-lg">
        <div className="inline-flex items-center gap-xs px-sm py-1 bg-surface-container rounded-full text-primary font-label-md text-[12px] uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">id_card</span>
          Powered by GPID — Global Patient Identifier
        </div>

        <h1 className="font-display text-display text-on-surface leading-tight">
          Your Medical Records.{" "}
          <span className="text-primary">Secure, Private,</span>{" "}
          Always in Your Control.
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[540px]">
          MediChain helps patients securely manage medical records, control
          doctor access, and maintain trusted healthcare history with
          privacy-first technology.
        </p>

        <div className="flex flex-wrap gap-md pt-sm">
          <Link
            to="/register"
            className="bg-primary-container hover:bg-primary text-white font-title-lg text-title-lg px-xl py-md rounded-xl transition-all shadow-lg hover:shadow-primary/20"
          >
            Get Started
          </Link>
          <button className="border border-outline-variant text-on-surface-variant font-title-lg text-title-lg px-xl py-md rounded-xl hover:bg-surface-variant/50 transition-all flex items-center gap-sm">
            <span className="material-symbols-outlined">play_circle</span>
            View Demo
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[600px] relative">
        <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full"></div>
        <div className="relative glass-card rounded-xl p-md shadow-2xl overflow-hidden">
          <img
            className="w-full h-auto rounded-lg"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDydcWF6c3J51atMzzYt3JEHeLKXI_e55hGX2NkixA4K-rv_EJCDnlDT3MYuNt1R3ORDVOfdz5W_logxMduLubR-mrhmO8_urqyLzDMghruSEG3ew_qd6cH7ZIB1uB4H_9v34zMaIps5l7NVEFc_HOf0bm51M_o3a9qJ2UmNVvpDd6I_SFvgy8KUuvmdINy3kEr7jEYVe1Fz22jTdWG9_VbUH06-5Z1_cJIQJjrtmTxBour4yCZf3EWMPug7Pp8YIef8aGPnbUmZ88"
            alt="MediChain Patient Dashboard"
          />
        </div>
      </div>
    </section>
  );
}
