import React from "react";

export default function ProgressIndicator({ currentStep, totalSteps, title, subtitle }) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="uppercase tracking-widest text-[#00677D]"
        style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}
      >
        Step {currentStep} of {totalSteps}
      </span>
      <div className="flex gap-1.5 mt-2 mb-4">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-full ${i < currentStep ? "bg-[#00677D]" : "bg-[#e8edff]"}`}
          />
        ))}
      </div>
      {title && (
        <h1
          className="text-[#101b30] md:text-[32px] text-[24px]"
          style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.01em" }}
        >
          {title}
        </h1>
      )}
      {subtitle && (
        <p
          className="text-[#3f484c]"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: 1.5, fontWeight: 400 }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
