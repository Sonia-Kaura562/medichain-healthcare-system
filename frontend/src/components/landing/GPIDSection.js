// src/components/landing/GPIDSection.js
import React from "react";

export default function GPIDSection() {
  return (
    <section id="gpid" className="py-xl bg-surface-container-low/50 -mx-margin-mobile md:-mx-xl px-margin-mobile md:px-xl">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
            What is a GPID?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[700px] mx-auto">
            Your Global Patient Identifier — a permanent, unique healthcare
            identity number recognized across every hospital, clinic, and lab on
            MediChain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center mb-xl">
          {/* Left Column */}
          <div className="space-y-lg">
            <h3 className="font-headline-md text-headline-md text-primary">
              One ID. Every Hospital. Lifetime Validity.
            </h3>
            <ul className="space-y-md">
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary-container">check_circle</span>
                <span className="font-body-md text-on-surface-variant">
                  <strong>Unique to you</strong> — no two patients share the same GPID
                </span>
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary-container">check_circle</span>
                <span className="font-body-md text-on-surface-variant">
                  <strong>Works across all hospitals</strong>, clinics, and labs on MediChain
                </span>
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary-container">check_circle</span>
                <span className="font-body-md text-on-surface-variant">
                  <strong>You own it</strong> — not the hospital, not the doctor, only you
                </span>
              </li>
            </ul>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Think of GPID like an Aadhaar number but specifically for your
              medical identity. Doctors search your GPID to instantly access your
              records — only if you have granted them permission.
            </p>
          </div>

          {/* Right Column — ID Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-[400px] aspect-[1.58/1] bg-surface-container-lowest border-2 border-primary/20 rounded-2xl shadow-xl p-lg relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>

              <div className="flex justify-between items-start mb-md">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary text-xl">health_and_safety</span>
                  <span className="font-title-lg text-primary font-bold text-sm">MediChain</span>
                </div>
                <div className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                  Digital Health Passport
                </div>
              </div>

              <div className="mt-auto mb-sm">
                <div className="text-[10px] text-on-surface-variant font-medium uppercase mb-xs opacity-60">
                  Global Patient Identifier
                </div>
                <div className="font-mono text-xl md:text-2xl font-bold text-on-surface tracking-wider">
                  PAT-2026-IN-00481
                </div>
              </div>

              <div className="grid grid-cols-3 gap-sm border-t border-outline-variant/30 pt-sm mt-sm">
                <div>
                  <div className="text-[9px] text-on-surface-variant/60 uppercase">Issued</div>
                  <div className="text-xs font-bold text-on-surface">2026</div>
                </div>
                <div>
                  <div className="text-[9px] text-on-surface-variant/60 uppercase">Status</div>
                  <div className="text-xs font-bold text-green-600">Active</div>
                </div>
                <div>
                  <div className="text-[9px] text-on-surface-variant/60 uppercase">Records</div>
                  <div className="text-xs font-bold text-on-surface">12 linked</div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                <span
                  className="material-symbols-outlined text-green-700"
                  style={{ fontSize: "10px" }}
                >
                  verified
                </span>
                <span className="text-[9px] font-bold text-green-700 uppercase">
                  Blockchain Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="bg-white p-lg rounded-xl border border-outline-variant/30 text-center shadow-sm">
            <h4 className="font-title-lg text-primary mb-1">Permanent</h4>
            <p className="font-body-md text-on-surface-variant">Valid for lifetime, never expires</p>
          </div>
          <div className="bg-white p-lg rounded-xl border border-outline-variant/30 text-center shadow-sm">
            <h4 className="font-title-lg text-primary mb-1">Universal</h4>
            <p className="font-body-md text-on-surface-variant">
              Recognized across all MediChain providers
            </p>
          </div>
          <div className="bg-white p-lg rounded-xl border border-outline-variant/30 text-center shadow-sm">
            <h4 className="font-title-lg text-primary mb-1">Private</h4>
            <p className="font-body-md text-on-surface-variant">
              Your GPID is yours to share or keep private
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
