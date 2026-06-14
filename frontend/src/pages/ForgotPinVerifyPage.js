import React, {

  useEffect,

  useState

} from "react";

import {

  useNavigate

} from "react-router-dom";

import api from "../services/api";

export default function ForgotPasswordVerifyPage() {

  const navigate = useNavigate();

  const [otp, setOtp] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resendLoading,

    setResendLoading

  ] = useState(false);

  const [timer,

    setTimer

  ] = useState(60);

  // =====================================
  // COUNTDOWN
  // =====================================
  useEffect(() => {

    if (timer <= 0) {

      return;
    }

    const interval =
      setInterval(() => {

        setTimer(

          (prev) => prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [timer]);

  // =====================================
  // VERIFY OTP
  // =====================================
  const handleVerify = async (e) => {

    e.preventDefault();

    setError("");

    const identifier =
      localStorage.getItem(

        "forgotPasswordIdentifier"
      );

    if (!otp.trim()) {

      setError(

        "Enter OTP"
      );

      return;
    }

    try {

      setLoading(true);

      await api.post(

        "/forgot-pin/verify-otp",

        {

          identifier,

          otp
        }
      );

      navigate(

        "/reset-pin"
      );

    } catch (err) {

      setError(

        err.response?.data?.error ||

        "OTP verification failed"
      );
    }

    finally {

      setLoading(false);
    }
  };

  // =====================================
  // RESEND OTP
  // =====================================
  const handleResend = async () => {

    try {

      setResendLoading(true);

      const identifier =
        localStorage.getItem(

          "forgotPasswordIdentifier"
        );

      await api.post(

        "/forgot-pin/resend-otp",

        {

          identifier
        }
      );

      setTimer(60);

      setError("");

    } catch (err) {

      setError(

        err.response?.data?.error ||

        "Failed to resend OTP"
      );

    } finally {

      setResendLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 w-full max-w-md border border-zinc-200 dark:border-zinc-800">

        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">

          Verify OTP

        </h2>

        <p className="text-sm text-zinc-500 mb-6">

          Enter the OTP sent to your registered email to reset your password.

        </p>

        <form
          onSubmit={handleVerify}
          className="space-y-5"
        >

          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            placeholder="Enter OTP"
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
          />

          {error && (

            <p className="text-red-500 text-sm">

              {error}

            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl transition"
          >

            {loading

              ? "Verifying..."

              : "Verify OTP"}

          </button>

        </form>

        <div className="mt-5 text-center">

          {timer > 0 ? (

            <p className="text-sm text-zinc-500">

              Resend OTP in

              {" "}

              {timer}s

            </p>

          ) : (

            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >

              {resendLoading

                ? "Resending..."

                : "Resend OTP"}

            </button>
          )}

        </div>

      </div>

    </div>
  );
}