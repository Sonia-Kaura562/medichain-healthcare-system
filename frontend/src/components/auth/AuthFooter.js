import React from "react";

export default function AuthFooter() {
  return (
    <footer className="w-full border-t border-[#E2E8F0] dark:border-outline bg-[#f9f9ff] dark:bg-[#00081C]">
      <div className="w-full py-6 px-4 flex flex-col items-center gap-3 max-w-[1440px] mx-auto md:flex-row md:justify-between md:px-12">
        <span
          className="text-[#3f484c] dark:text-outline-variant order-1 md:order-none"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: 1.5 }}
        >
          © 2026 MediChain Ledger. All rights reserved.
        </span>
        <div className="flex gap-6 order-2 md:order-none">
          {["Privacy Policy", "Terms", "Support"].map((label) => (
            <a
              key={label}
              className="text-[#3f484c] dark:text-outline-variant hover:text-[#00677D] transition-colors"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}
              href="#"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
