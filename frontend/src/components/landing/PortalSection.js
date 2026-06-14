// src/components/landing/PortalSection.js
import React from "react";
import { Link } from "react-router-dom";

export default function PortalSection() {
  return (
    <section className="py-xl space-y-xl" id="features">
      <div className="text-center mb-lg">
        <h2 className="font-headline-lg text-headline-lg">
          Three Portals, One Trusted Ledger
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Customized workflows for every stakeholder in the healthcare ecosystem.
        </p>
      </div>

      {/* How It Works Timeline */}
      <div className="py-xl bg-surface-container-lowest rounded-xl p-xl border border-outline-variant/20 my-xl">
        <h2 className="font-headline-lg text-headline-lg text-center mb-xl">
          Simple Lifecycle of Care
        </h2>
        <div className="flex flex-col md:flex-row gap-lg relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-outline-variant/30 z-0"></div>
          {[
            {
              num: "1",
              title: "GPID Identity",
              desc: "Register once and receive your permanent Global Patient ID. Share it with any hospital or doctor — they instantly find your complete verified record.",
            },
            {
              num: "2",
              title: "Upload Records",
              desc: "Sync your history from hospitals, labs, and personal devices.",
            },
            {
              num: "3",
              title: "Grant Access",
              desc: "Search doctors and securely control record access.",
            },
            {
              num: "4",
              title: "Receive Care",
              desc: "Doctors treat you with full context, preventing clinical errors.",
            },
          ].map((step) => (
            <div key={step.num} className="flex-1 relative z-10 text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-md border-4 border-white shadow-md">
                {step.num}
              </div>
              <h4 className="font-title-lg text-title-lg mb-xs">{step.title}</h4>
              <p className="font-body-md text-body-md text-on-surface-variant px-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Portal Card */}
      <div id="patient-portal" className="flex flex-col md:flex-row items-center gap-xl bg-white p-xl rounded-xl border border-outline-variant/30">
        <div className="flex-1 space-y-md">
          <div className="text-primary-container font-label-md text-label-md uppercase font-bold">
            For Patients
          </div>
          <h3 className="font-headline-md text-headline-md">
            Your Health at Your Fingertips
          </h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Manage your family's health journey with absolute privacy. Receive
            medication reminders, view lab results as soon as they're ready, and
            maintain a lifelong summary.
          </p>
          <div className="grid grid-cols-2 gap-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary-container">notifications_active</span>
              <span className="font-body-md text-body-md">Smart Reminders</span>
            </div>
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary-container">summarize</span>
              <span className="font-body-md text-body-md">History Summary</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <img
            className="rounded-lg shadow-xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6vhgPpLgo7REDOOHKKQcF0xY5s57rJKnkYsRYqwRhZnwyqlkVoNPtvXgEzsBGFQkxE83VDM467vRZNj1knRuDkEVh0S2wl8WEEoCcL3rj97woKGSyXwwtAiqsWLZSm2c65CgKf2jPI0Qrg4ZHNZ5NwcFSRiDVXpbzgtPeX-wk59sk_hV1GjxfErQ_UWASc4WUk8tjcKHp-BItppQ-NMCXsQOQvV6iVrX5arTV9cGRsZxrThCicDF9cFef8Jl0otYaL2DpEKNHM_8"
            alt="Patient Portal"
          />
        </div>
      </div>

      {/* Doctor Portal Card */}
      <div id="doctor-portal" className="flex flex-col md:flex-row-reverse items-center gap-xl bg-surface-container-low p-xl rounded-xl border border-outline-variant/30">
        <div className="flex-1 space-y-md">
          <div className="text-primary font-label-md text-label-md uppercase font-bold">
            For Doctors
          </div>
          <h3 className="font-headline-md text-headline-md">
            Informed Decisions, Faster
          </h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Access complete patient history instantly and identify treatment
            conflicts for safer, more informed clinical decisions.
          </p>
          <div className="grid grid-cols-2 gap-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">warning</span>
              <span className="font-body-md text-body-md">Conflict Alerts</span>
            </div>
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">psychology</span>
              <span className="font-body-md text-body-md">Smart Diagnosis</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <img
            className="rounded-lg shadow-xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPj1pu7b5o8ZtGmFXwjloKhtR5AoETQgul-SEX1fcCXI549_oC_VEk3nm-BunMKz8LgTciKL5he6vawQfPqZRhhq_SCac2klGgKZsMvoKqLylDWAQ3w2af1bklSMPuBoZA62R4JWbZRTHMho6Gp296nh8NyD8ccrQl82sXp-_9TQrzk9oDVYpKToSU5HojtgHOyhV5Lg9LEPELwcNTOyYJrNjLXC1gMRUow5O6v5LzPsgCnBbeBVjyXIVStInt10RuY-vHGYXMMWk"
            alt="Doctor Portal"
          />
        </div>
      </div>

      {/* Admin Portal Card */}
      <div id="admin-portal" className="flex flex-col md:flex-row items-center gap-xl bg-white p-xl rounded-xl border border-outline-variant/30">
        <div className="flex-1 space-y-md">
          <div className="text-primary-container font-label-md text-label-md uppercase font-bold">
            For Administrators
          </div>
          <h3 className="font-headline-md text-headline-md">
            Secure Healthcare Network Management
          </h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Monitor doctor verification, emergency approvals, blockchain
            activity, security alerts, and healthcare system operations from one
            centralized control panel.
          </p>
          <div className="grid grid-cols-2 gap-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary-container">person_check</span>
              <span className="font-body-md text-body-md">Doctor Verification</span>
            </div>
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary-container">lock_open</span>
              <span className="font-body-md text-body-md">Emergency Approvals</span>
            </div>
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary-container">list_alt</span>
              <span className="font-body-md text-body-md">Audit Logs</span>
            </div>
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary-container">hub</span>
              <span className="font-body-md text-body-md">Blockchain Monitoring</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <img
            className="rounded-lg shadow-xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwzz-xEoTy04w89ZR1cMCeX6lwVS6bygm8aDPnBdXIGxpuQSHVQZQ--gK-W743g8pnim1DSaQWrXKb_v7dR7Wa5bAN_5SBgFU8_V8pPk6rDuQ-ZlpXwuY2uURBw08rQKpHpGRaEHeluMD6kBnXRZ2g2pCtsBdyFvHPjDELzB4G4lvkMYdwDLY21JSg8eWZRcg0pALZIy9p7meX76Rz2bn0ckpfdKXbID7pf0f70MpQF7YNt_yUpSftgH5rg55E15VQpsKOXIqGQeg"
            alt="Admin Portal"
          />
        </div>
      </div>
    </section>
  );
}
