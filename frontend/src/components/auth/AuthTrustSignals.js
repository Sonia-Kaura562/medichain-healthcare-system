// src/components/auth/AuthTrustSignals.js
import React from "react";

const SIGNALS = [
  { icon: "encrypted",     label: "Encrypted Medical Records"    },
  { icon: "verified_user", label: "Consent-Based Access"         },
  { icon: "history_edu",   label: "Tamper-Protected Audit Trail" },
];

export default function AuthTrustSignals() {
  return (
    <>
      {/* Trust signal list */}
      <div className="pt-6 border-t border-border-subtle flex flex-col gap-3">
        {SIGNALS.map((s) => (
          <div key={s.icon} className="flex items-center gap-2.5">
            <span
              className="material-symbols-outlined text-clinical-blue text-[16px] opacity-60 shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {s.icon}
            </span>
            <span className="text-[13px] font-body-sm text-on-surface-variant/70 tracking-tight leading-none">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* SSL badge */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full border border-border-subtle/30">
          <span
            className="material-symbols-outlined text-success-teal text-[14px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified_user
          </span>
          <span className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
            Secure SSL Session
          </span>
        </div>
      </div>
    </>
  );
}
