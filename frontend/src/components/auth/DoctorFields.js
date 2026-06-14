// src/components/auth/DoctorFields.js

import React from "react";

export default function DoctorFields({
  hospitalName,
  licenseNumber,
  onChange,
}) {
  return (
    <>
      {/* Hospital Name */}
      <div className="relative">
        <input
          id="hospital-name"
          type="text"
          placeholder=" "
          value={hospitalName}
          onChange={(e) =>
            onChange("hospitalName", e.target.value)
          }
          className="peer w-full h-[66px] px-4 pt-6 pb-2 bg-white border border-[#E2E8F0] rounded-[2px] outline-none text-[#101b30] focus:border-[#00677D]"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        />

        <label
          htmlFor="hospital-name"
          className="
            absolute left-4 pointer-events-none transition-all duration-200
            text-[#3f484c]
            peer-placeholder-shown:top-[22px]
            peer-placeholder-shown:text-[16px]
            peer-placeholder-shown:text-[#3f484c]
            peer-focus:top-[10px]
            peer-focus:text-[12px]
            peer-focus:text-[#00677D]
            top-[10px]
            text-[12px]
          "
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Hospital Name
        </label>
      </div>

      {/* License Number */}
      <div className="relative">
        <input
          id="license-number"
          type="text"
          placeholder=" "
          value={licenseNumber}
          onChange={(e) =>
            onChange("licenseNumber", e.target.value)
          }
          className="peer w-full h-[66px] px-4 pt-6 pb-2 bg-white border border-[#E2E8F0] rounded-[2px] outline-none text-[#101b30] focus:border-[#00677D]"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        />

        <label
          htmlFor="license-number"
          className="
            absolute left-4 pointer-events-none transition-all duration-200
            text-[#3f484c]
            peer-placeholder-shown:top-[22px]
            peer-placeholder-shown:text-[16px]
            peer-placeholder-shown:text-[#3f484c]
            peer-focus:top-[10px]
            peer-focus:text-[12px]
            peer-focus:text-[#00677D]
            top-[10px]
            text-[12px]
          "
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          License Number
        </label>
      </div>
    </>
  );
}