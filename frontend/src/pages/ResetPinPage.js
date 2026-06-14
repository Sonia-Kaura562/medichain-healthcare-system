import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPinPage() {

  const navigate = useNavigate();

  const [
    newPassword,

    setNewPassword
  ] = useState("");

  const [
    confirmPassword,

    setConfirmPassword
  ] = useState("");

  const [
    showPassword,

    setShowPassword
  ] = useState(false);

  const [
    showConfirmPassword,

    setShowConfirmPassword

  ] = useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);
  // =====================================
  // RESET PASSWORD
  // =====================================
  const handleReset = async (e) => {

    e.preventDefault();

    setError("");

    const identifier =
      localStorage.getItem(

        "forgotPasswordIdentifier"
      );

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{10,}$/;

    if (
      !passwordRegex.test(
        newPassword
      )
    ) {

      setError(

        "Password must contain at least 10 characters, one uppercase letter, one lowercase letter, one number and one special character."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {

      setError(

        "Passwords do not match"
      );

      return;
    }

    try {

      setLoading(true);

      await api.post(

        "/reset-pin",

        {
          identifier,

          newPin:
            newPassword
        }
      );

      alert(

        "Password reset successfully"
      );

      navigate(

        "/login"
      );

    } catch (err) {

      setError(

        err.response?.data?.error ||

        "Failed to Reset password"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 w-full max-w-md border border-zinc-200 dark:border-zinc-800">

        <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">

          Reset Password

        </h2>

        <p className="text-sm text-zinc-500 mb-6">

          Create your new password.

        </p>

        <form
          onSubmit={handleReset}
          className="space-y-5"
        >

          {/* NEW PASSWORD */}

          <div className="relative">

            <input
              type={
                showPassword

                  ? "text"

                  : "password"
              }
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              placeholder="New Password"
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 pr-12"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(

                  !showPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
            >

              {showPassword ? (

                <EyeOff size={18} />

              ) : (

                <Eye size={18} />
              )}

            </button>

          </div>

          {/* Confirm Password */}

          <div className="relative">

            <input
              type={
                showConfirmPassword

                  ? "text"

                  : "password"
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 pr-12"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(

                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
            >

              {showConfirmPassword ? (

                <EyeOff size={18} />

              ) : (

                <Eye size={18} />
              )}

            </button>

          </div>

          {error && (

            <p className="text-red-500 text-sm">

              {error}

            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >

            {loading

              ? "Resetting..."

              : "Reset Password"}

          </button>

        </form>

      </div>

    </div>
  );
}