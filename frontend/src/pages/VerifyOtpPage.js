import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import AuthHeader from "../components/auth/AuthHeader";
import AuthFooter from "../components/auth/AuthFooter";
import ProgressIndicator from "../components/auth/ProgressIndicator";

export default function VerifyOtpPage() {
  const navigate = useNavigate();

  const registerData = JSON.parse(
    localStorage.getItem("registerData")
  );

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendState, setResendState] = useState("idle");
  const inputRefs = useRef([]);

  // ============================
  // AUTO FOCUS FIRST INPUT
  // ============================
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // ============================
  // TIMER
  // ============================
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  // ============================
  // OTP INPUT HANDLER
  // ============================
  const handleChange = (index, value) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) return;

    const newOtp = [...otp];
    newOtp[index] = numericValue[0];
    setOtp(newOtp);

    // Move next
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ============================
  // BACKSPACE HANDLER
  // ============================
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // ============================
  // PASTE OTP HANDLER
  // ============================
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    // Focus last filled input
    const focusIndex =
      Math.min(pastedData.length, 5);

    inputRefs.current[focusIndex]?.focus();
  };
  // ============================
  // VERIFY OTP
  // ============================
  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        otp: finalOtp,
      };

      if (registerData.email) {
        payload.email =
          registerData.email;
      } else {
        payload.contact =
          registerData.contact;
      }

      const res = await api.post(
        "/verify-otp",
        payload
      );

      // Save verified user
      localStorage.setItem(
        "verifiedUser",
        JSON.stringify({

          ...registerData,

          userId:
            res.data.userId
        })
      );

      localStorage.setItem(
        "userId",
        res.data.userId
      );

      localStorage.setItem(
        "role",
        res.data.role
      );

      navigate("/set-pin");

    } catch (err) {
      setError(
        err.response?.data?.error ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // RESEND OTP
  // ============================
const handleResend = async () => {
  try {

    setResendState(
      "loading"
    );

    const payload = {
      fullName:
        registerData.fullName,

      role:
        registerData.role,

      country:
        registerData.country,

      hospitalName:
        registerData.hospitalName,

      licenseNumber:
        registerData.licenseNumber,
    };

    // Email flow
    if (registerData.email) {
      payload.email =
        registerData.email;
    }

    // Phone flow
    if (registerData.contact) {
      payload.contact =
        registerData.contact;
    }

    await api.post(
      "/send-otp",
      payload
    );

    setSeconds(60);
    setError("");

    setResendState(
      "sent"
    );

    setTimeout(() => {
      setResendState(
        "idle"
      );
    }, 2000);

  } catch (err) {

    setResendState(
      "idle"
    );

    setError(
      err.response?.data?.error ||
      "Failed to resend OTP"
    );
  }
};

  return (
    <div
      className="text-[#101b30] flex flex-col bg-[#f6faff]"
      style={{
        minHeight: "max(884px, 100dvh)",
      }}
    >
      {/* Header */}
      <AuthHeader />

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">

        <div className="w-full max-w-[480px]">

          {/* Card */}
          <div className="bg-white border border-[#E2E8F0] rounded shadow-[0_8px_30px_rgb(0,77,95,0.04)] p-12 flex flex-col">

            {/* Progress */}
            <ProgressIndicator
              currentStep={2}
              totalSteps={3}
              title="Verify Your Identity"
              subtitle="Enter the verification code sent to your email or phone."
            />

            {/* OTP Boxes */}
            <div className="w-full mb-6 mt-2">
              <div className="flex justify-between gap-2 md:gap-3">

                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) =>
                      (inputRefs.current[index] =
                        el)
                    }
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleChange(
                        index,
                        e.target.value
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(index, e)
                    }
                    onPaste={handlePaste}
                    className="w-12 h-16 text-center border border-[#BEC8CC] rounded bg-white text-[24px] outline-none focus:border-[#00677D] focus:ring-1 focus:ring-[#00677D]"
                    style={{
                      fontFamily:
                        "Inter, sans-serif",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-2 mb-8 text-[#3f484c] justify-center">
              <span className="material-symbols-outlined text-[18px]">
                mail
              </span>

              <span
                style={{
                  fontFamily:
                    "Inter, sans-serif",
                  fontSize: "14px",
                }}
              >
                OTP sent to{" "}
                <span className="text-[#101b30] font-medium">
                  {registerData.email ||
                    registerData.contact}
                </span>
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="text-[#ba1a1a] text-sm text-center mb-4">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-[#00677D] text-white py-4 rounded hover:bg-[#004d5f] transition-all active:scale-[0.98] uppercase"
              style={{
                fontFamily:
                  "Inter, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              {loading
                ? "VERIFYING..."
                : "VERIFY OTP"}
            </button>

            {/* Resend */}
            <button
              onClick={
                seconds === 0
                  ? handleResend
                  : undefined
              }
              disabled={
                seconds > 0 ||
                resendState === "loading"
              }
              className="
                w-full flex justify-center
                items-center gap-2
                text-[#3f484c]
                py-3 mt-2
                hover:text-[#00677D]
                transition-all
              "
              style={{
                fontFamily:
                  "Inter, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >

              {resendState ===
              "loading" ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#00677D] border-t-transparent rounded-full animate-spin" />
                  SENDING...
                </>
              ) : resendState ===
                "sent" ? (
                <>
                  OTP SENT ✓
                </>
              ) : (
                <>
                  RESEND OTP

                  {seconds > 0 && (
                    <span className="text-[14px] ml-1">
                      ({seconds}s)
                    </span>
                  )}
                </>
              )}
            </button>

            {/* SSL */}
            <div className="mt-12 pt-3 border-t border-[#E2E8F0] flex justify-center items-center gap-1.5 text-[#3f484c]">

              <span className="material-symbols-outlined text-[16px] text-[#00A4A6]">
                verified_user
              </span>

              <span
                className="uppercase tracking-widest"
                style={{
                  fontFamily:
                    "Inter, sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                Secure SSL Session
              </span>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}