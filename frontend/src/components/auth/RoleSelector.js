import React from "react";

export default function RoleSelector({ role, onRoleChange }) {
  const roles  = ["patient", "doctor", "admin"];
  const labels = ["Patient", "Doctor", "Admin"];
  const activeIndex = roles.indexOf(role);

  return (
    <div className="relative bg-[#e8edff] p-1 rounded-lg flex items-center h-12">
      <div
        className="absolute h-10 bg-white rounded shadow-sm z-0"
        style={{
          width: "calc(33.33% - 4px)",
          transform: `translateX(calc(${activeIndex * 100}% + 2px))`,
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      {roles.map((r, i) => (
        <button
          key={r}
          type="button"
          className={`relative z-10 flex-1 text-center transition-colors ${
            activeIndex === i ? "text-[#101b30] font-bold" : "text-[#3f484c]"
          }`}
          style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", letterSpacing: "0.05em", fontWeight: activeIndex === i ? 700 : 600 }}
          onClick={() => onRoleChange(r)}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}
