// src/components/landing/SecuritySection.js
import React from "react";

export default function SecuritySection() {
  const cards = [
    {
      icon: "lock",
      title: "End-to-End Encryption",
      desc: "Only you and your authorized doctors hold the decryption keys.",
    },
    {
      icon: "receipt_long",
      title: "Immutable Ledger",
      desc: "A permanent, tamper-proof record of every single interaction.",
    },
    {
      icon: "health_and_safety",
      title: "IPFS-Powered Storage",
      desc: "Secure decentralized storage for medical records with enhanced reliability, integrity, and accessibility.",
    },
  ];

  return (
    <section className="py-xl" id="security">
      <h2 className="font-headline-lg text-headline-lg text-center mb-xl">
        Security by Design
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter items-stretch">
        {cards.map((card) => (
          <div
            key={card.title}
            className="p-lg bg-white rounded-xl border border-outline-variant/30 flex flex-col items-center text-center hover:-translate-y-1 transition-transform h-full"
          >
            <div className="h-16 flex items-center justify-center mb-md">
              <span
                className="material-symbols-outlined text-primary text-4xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                {card.icon}
              </span>
            </div>
            <h5 className="font-title-lg text-title-lg mb-xs h-[48px] flex items-center">
              {card.title}
            </h5>
            <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Emergency Access */}
      <div className="mt-xl py-xl bg-error/5 rounded-3xl p-xl border border-error/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-error/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="flex flex-col md:flex-row items-center gap-xl relative z-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-sm text-error font-bold mb-md">
              <span className="material-symbols-outlined">e911_emergency</span>
              CRITICAL CARE PROTOCOL
            </div>
            <h2 className="font-headline-lg text-headline-lg mb-md">
              When Seconds Matter
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
              In a life-threatening emergency where you cannot provide consent,
              authorized ER physicians can trigger an "Emergency Break-Glass"
              protocol. This provides temporary, audited access to your
              allergies, blood type, and current medications, while instantly
              notifying your emergency contacts.
            </p>
          </div>

          <div className="flex-1 w-full max-w-sm">
            <div className="bg-white p-lg rounded-xl border-2 border-error shadow-xl space-y-md">
              <div className="flex items-center justify-between">
                <span className="font-bold text-error font-label-md">EMERGENCY ACCESS</span>
                <span className="material-symbols-outlined text-error">medical_services</span>
              </div>

              <div className="space-y-xs">
                <div className="text-[10px] text-on-surface-variant/60 font-label-md uppercase">
                  Time Remaining
                </div>
                <div className="h-1.5 w-full bg-error/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-error rounded-full"
                    style={{ width: "70%", animation: "countdown 300s linear infinite" }}
                  ></div>
                </div>
              </div>

              <div className="space-y-sm pt-xs">
                <div className="flex justify-between font-body-md text-on-surface-variant border-b border-outline-variant/20 pb-xs">
                  <span className="text-on-surface-variant/70">Status</span>
                  <span className="text-error font-bold tracking-wide">Approved</span>
                </div>
                <div className="flex justify-between items-start font-body-md text-on-surface-variant border-b border-outline-variant/20 pb-xs">
                  <span className="text-on-surface-variant/70">Physician</span>
                  <span className="text-right font-medium">Dr. Rajesh Sharma (Verified)</span>
                </div>
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span className="text-on-surface-variant/70">Expires In</span>
                  <span className="font-medium">04:59:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
