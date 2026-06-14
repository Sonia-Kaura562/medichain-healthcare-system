import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function LoginPage() {

  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================
  // LOGIN
  // =====================================
  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    if (!identifier.trim()) {

      setError(

        "Enter Email, Phone or GPID"
      );

      return;
    }

    if (!password.trim()) {

      setError(
        "Enter password"
      );

      return;
    }

    try {

      setLoading(true);

      const res = await api.post(

        "/login",

        {

          identifier,

          password
        }
      );

      // =================================
      // STORE AUTH
      // =================================
      localStorage.setItem(

        "accessToken",

        res.data.accessToken
      );

      localStorage.setItem(

        "refreshToken",

        res.data.refreshToken
      );

      localStorage.setItem(

        "userId",

        res.data.user.userId
      );

      localStorage.setItem(

        "role",

        res.data.user.role
      );

      // =================================
      // ROLE REDIRECT
      // =================================
      const role =

        res.data.user.role;

      if (role === "patient") {

        navigate("/patient");
      }

      else if (

        role === "doctor"
      ) {

        navigate("/doctor");
      }

      else if (

        role === "admin"
      ) {

        navigate("/admin");
      }

    } catch (err) {

      setError(

        err.response?.data?.error ||

        "Login failed"
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

            Welcome Back

          </h2>

          <p className="text-sm text-zinc-500 mb-6">

            Login to your
            MediChain account

          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* IDENTIFIER */}

            <div>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">

                Email / Phone / GPID

              </label>

              <input
                type="text"
                value={identifier}
                onChange={(e) =>
                  setIdentifier(
                    e.target.value
                  )
                }
                placeholder="Enter email, phone or GPID"
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                required
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">

                Password

              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-3 text-zinc-500"
                >

                  {showPassword

                    ? <EyeOff size={20} />

                    : <Eye size={20} />}

                </button>

              </div>

            </div>

            {/* Forgot PASSWORD */}

            <div className="text-right">

              <Link
                to="/forgot-pin"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?

              </Link>

            </div>

            {/* Error */}

            {error && (

              <div className="text-red-500 text-sm">

                {error}

              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition"
            >

              {loading

                ? "Signing in..."

                : "Login"}

            </button>

          </form>

          {/* Register */}

          <p className="text-center text-sm text-zinc-500 mt-6">

            New to MediChain?

            {" "}

            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >

              Create account

            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}