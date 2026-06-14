// src/components/landing/ProblemSection.js
import React from "react";

export default function ProblemSection() {
  return (
    <section className="py-xl" id="solutions">
      <div className="text-center mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
          Why Medical Records Need Improvement
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-[600px] mx-auto">
          Traditional record-keeping is fragmented, inefficient, and puts your
          privacy at risk. MediChain fixes the core infrastructure of health data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Problem Card */}
        <div className="md:col-span-1 bg-surface-container-low p-xl rounded-xl border border-outline-variant/30 flex flex-col">
          <div className="w-12 h-12 bg-error-container text-error rounded-lg flex items-center justify-center mb-md">
            <span className="material-symbols-outlined">broken_image</span>
          </div>
          <h3 className="font-title-lg text-title-lg mb-sm">The Status Quo</h3>
          <ul className="space-y-sm text-on-surface-variant font-body-md">
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-error text-sm mt-1">cancel</span>
              Scattered medical history across providers.
            </li>
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-error text-sm mt-1">cancel</span>
              Redundant tests due to missing data.
            </li>
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-error text-sm mt-1">cancel</span>
              Paper-based consent prone to loss.
            </li>
          </ul>
        </div>

        {/* Solution Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-gutter">
          <div className="bg-white p-lg rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow group">
            <span className="material-symbols-outlined text-primary mb-sm transition-transform group-hover:scale-110">
              admin_panel_settings
            </span>
            <h4 className="font-title-lg text-title-lg mb-xs">Patient Control</h4>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Decide exactly which doctors see which parts of your record, with
              one-click revocation.
            </p>
          </div>

          <div className="bg-white p-lg rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow group">
            <span className="material-symbols-outlined text-primary mb-sm transition-transform group-hover:scale-110">
              history_edu
            </span>
            <h4 className="font-title-lg text-title-lg mb-xs">Audit Trail</h4>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Every access and modification is cryptographically signed and
              permanently logged.
            </p>
          </div>

          <div className="bg-white p-lg rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow group">
            <span className="material-symbols-outlined text-primary mb-sm transition-transform group-hover:scale-110">
              share_reviews
            </span>
            <h4 className="font-title-lg text-title-lg mb-xs">Secure Sharing</h4>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Share high-resolution imaging and lab results instantly with
              specialists globally.
            </p>
          </div>

          <div className="bg-white p-lg rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow group">
            <span className="material-symbols-outlined text-primary mb-sm transition-transform group-hover:scale-110">
              medical_services
            </span>
            <h4 className="font-title-lg text-title-lg mb-xs">Emergency Access</h4>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Life-saving override protocol for critical care situations when you
              can't provide consent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
