import React from "react";
import { Link } from "react-router-dom";

export default function AuthHeader() {
  return (
    <header className="w-full bg-[#F9FAFF] border-b border-[#E2E8F0]">
      <div className="h-[72px] flex items-center justify-between px-6">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-[10px]"
        >
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
          >
            MediChain
          </span>
        </Link>

        {/* Sign In */}
        <Link
          to="/login"
          className="flex items-center justify-center border border-[#D7E3EA] rounded-[2px] bg-transparent hover:bg-[#F4F7FB] transition-colors"
          style={{
            width: "80px",
            height: "40px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#00677D",
          }}
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}