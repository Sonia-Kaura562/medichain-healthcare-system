import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function ForgotPasswordPage() {

  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const [identifier, setIdentifier] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================
  // SEND OTP
  // =====================================
  const handleSendOtp = async (e) => {

    e.preventDefault();

    setError("");

    if (!identifier.trim()) {

      setError(

        "Enter Email, Phone or GPID"
      );

      return;
    }

    try {

      setLoading(true);

      await api.post(

        "/forgot-pin/send-otp",

        {
          identifier
        }
      );

      localStorage.setItem(

        "forgotPasswordIdentifier",

        identifier
      );

      navigate(

        "/forgot-pin-verify"
      );

    } catch (err) {

      setError(

        err.response?.data?.error ||

        "Failed to send OTP"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Theme */}

        <div className="flex justify-end mb-4">

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white"
          >

            {theme === "dark"

              ? "☀ Light"

              : "🌙 Dark"}

          </button>

        </div>

        {/* Card */}

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">

            Forgot PASSWORD

          </h2>

          <p className="text-sm text-zinc-500 mb-6">

            Enter your Email,
            Phone or GPID to
            receive a password reset OTP.

          </p>

          <form
            onSubmit={handleSendOtp}
            className="space-y-5"
          >

            <input
              type="text"
              value={identifier}
              onChange={(e) =>
                setIdentifier(
                  e.target.value
                )
              }
              placeholder="Email / Phone / GPID"
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
              required
            />

            {error && (

              <div className="text-red-500 text-sm">

                {error}

              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition"
            >

              {loading

                ? "Sending OTP..."

                : "Send OTP"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}