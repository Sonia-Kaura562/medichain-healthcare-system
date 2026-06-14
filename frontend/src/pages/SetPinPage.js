import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function SetPinPage() {

  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const [password, setPassword] =
  useState("");

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

  const [walletAddress, setWalletAddress] =

    useState("");

  const [loading, setLoading] =

    useState(false);

  const [error, setError] =

    useState("");

  const verifiedUser =
    JSON.parse(
      localStorage.getItem(
        "verifiedUser"
      )
    );

  // =====================================
  // CONNECT METAMASK
  // =====================================
  const connectWallet = async () => {

    try {

      if (!window.ethereum) {

        setError(

          "MetaMask extension is not installed"
        );

        return;
      }

      const accounts =

        await window.ethereum.request({

          method:

            "eth_requestAccounts"
        });

      if (!accounts.length) {

        setError(

          "No wallet account found"
        );

        return;
      }

      setWalletAddress(

        accounts[0]
      );

      setError("");

    } catch (err) {

      console.log(err);

      setError(

        err.message ||

        "Failed to connect wallet"
      );
    }
  };

  // =====================================
  // SUBMIT
  // =====================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

// PASSWORD VALIDATION
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{10,}$/;

if (
  !passwordRegex.test(
    password
  )
) {

  setError(

    "Password must contain at least 10 characters, one uppercase letter, one lowercase letter, one number and one special character."
  );

  return;
}

if (
  password !==
  confirmPassword
) {

  setError(

    "Passwords do not match"
  );

  return;
}

    try {

      setLoading(true);

      const payload = {

        userData:
          verifiedUser,

        password
      };

      // Optional wallet
      if (walletAddress) {

        payload.walletAddress =

          walletAddress;
      }

      const response =
        await api.post(

        "/set-pin",

        payload
      );

      alert(

        `Account created successfully!\n\nYour GPID: ${verifiedUser.userId}`
      );

      localStorage.removeItem(
        "verifiedUser"
      );

      navigate("/login");

    } catch (err) {

      setError(

        err.response?.data?.error ||

        "Failed to set password"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Theme Toggle */}

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

            Secure Your Account

          </h2>

          <p className="text-sm text-zinc-500 mb-6">

            Create a strong password
            to secure your MediChain account.

          </p>

          {/* GPID */}

          <div className="mb-5 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800">

            <p className="text-xs text-zinc-500">

              Your GPID

            </p>

            <p className="font-semibold text-zinc-900 dark:text-white">

              {verifiedUser?.userId ||
                "Generating..."}

            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* CREATE password */}

            <div>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">

                Create password

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

            {/* CONFIRM password */}

            <div>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">

                Confirm password

              </label>

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
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-3 text-zinc-500"
                >

                  {showConfirmPassword

                    ? <EyeOff size={20} />

                    : <Eye size={20} />}

                </button>

              </div>

            </div>

            {/* WALLET */}

            <div className="border border-zinc-300 dark:border-zinc-700 rounded-xl p-4">

              <p className="text-sm font-medium text-zinc-900 dark:text-white">

                Blockchain Wallet

              </p>

              <p className="text-xs text-zinc-500 mt-1 mb-4">

                Optional. Connect MetaMask
                or paste wallet manually.

              </p>

              {/* Connect Wallet */}

              <button
                type="button"
                onClick={connectWallet}
                className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-zinc-700 text-white hover:opacity-90 transition"
              >

                Connect MetaMask

              </button>

              {/* Connected */}

              {walletAddress && (

                <div className="mt-3">

                  <p className="text-xs text-green-600">

                    Connected:

                    {" "}

                    {walletAddress.slice(0, 6)}

                    ...

                    {walletAddress.slice(-4)}

                  </p>

                  <button
                    type="button"
                    onClick={() => {

                      setWalletAddress("");

                      setError("");
                    }}
                    className="text-sm text-red-500 hover:underline mt-2"
                  >

                    Clear Wallet

                  </button>

                </div>
              )}

              {/* Divider */}

              <div className="flex items-center my-4">

                <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>

                <span className="px-3 text-xs text-zinc-500">

                  OR

                </span>

                <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>

              </div>

              {/* Manual Input */}

              <input
                type="text"
                value={walletAddress}
                onChange={(e) => {

                  setWalletAddress(
                    e.target.value
                  );

                  setError("");
                }}
                placeholder="Paste wallet address (0x...)"
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none text-sm"
              />

            </div>
            {/* ERROR */}

            {error && (

              <div className="text-red-500 text-sm">

                {error}

              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition"
            >

              {loading

                ? "Creating Account..."

                : "Finish Setup"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}