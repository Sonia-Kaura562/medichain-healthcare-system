import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AuthHeader from "../components/auth/AuthHeader";
import ProgressIndicator from "../components/auth/ProgressIndicator";
import RoleSelector from "../components/auth/RoleSelector";
import DoctorFields from "../components/auth/DoctorFields";
import AuthFooter from "../components/auth/AuthFooter";
import countryList from "react-select-country-list";
import { parsePhoneNumberFromString } from "libphonenumber-js";
const countries = countryList().getData();
export default function SendOtpPage() {
  const navigate = useNavigate();

  const [role, setRole]                   = useState("patient");
  const [fullName, setFullName]           = useState("");
  const [contact, setContact]             = useState("");
  const [country, setCountry]             = useState("");
  const [hospitalName, setHospitalName]   = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [btnState, setBtnState]           = useState("idle");
  const [error, setError]                 = useState("");

  function handleDoctorFieldChange(field, value) {
    if (field === "hospitalName")  setHospitalName(value);
    if (field === "licenseNumber") setLicenseNumber(value);
  }

 async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  // ==========================
  // VALIDATIONS
  // ==========================
  if (!fullName.trim()) {
    setError("Full name is required.");
    return;
  }

  if (!country) {
    setError("Please select country.");
    return;
  }

  if (!contact.trim()) {
    setError("Email address is required.");
    return;
  }

  const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmail =
    emailRegex.test(contact);

  let isPhone =
    false;

  if (!isEmail) {

    try {

      const phoneNumber =

        parsePhoneNumberFromString(

          contact,

          country
        );

      isPhone =

        phoneNumber?.isValid();

    } catch {

      isPhone =
        false;
    }
  }

  if (
    !isEmail &&
    !isPhone
  ) {

    setError(

      "Please enter a valid email or phone number."
    );

    return;
  }

  setBtnState("loading");

  // ==========================
  // PAYLOAD
  // ==========================
  const payload = {
    role,
    fullName,
    country,
  };

  // Send email OR contact
  if (isEmail) {
    payload.email = contact;
  } else {
    payload.contact = contact;
  }

  // Doctor fields
  if (role === "doctor") {
    payload.hospitalName =
      hospitalName;

    payload.licenseNumber =
      licenseNumber;
  }

  try {
    await api.post(
      "/send-otp",
      payload
    );

    // Save for OTP page
    localStorage.setItem(
      "registerData",
      JSON.stringify({
        fullName,
        role,
        hospitalName,
        licenseNumber,
        country,

        email:
          isEmail
            ? contact
            : "",

        contact:
          isPhone
            ? contact
            : "",
      })
    );

    setBtnState("sent");

    setTimeout(() => {
      navigate("/verify-otp");
    }, 1000);

  } catch (err) {

    setError(
      err.response?.data?.error ||
      "Failed to send OTP."
    );

    setBtnState("idle");
  }
}

  const btnLabel =
    btnState === "loading" ? "PROCESSING..." :
    btnState === "sent"    ? "OTP SENT"      :
                             "Send OTP";

  return (
    <div
      className="text-[#101b30] flex flex-col bg-[#f6faff]"
      style={{ minHeight: "max(884px, 100dvh)" }}
    >
      {/* Header */}
      <AuthHeader />

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

        {/* Card */}
        <div className="w-full max-w-[480px] bg-white rounded shadow-[0_8px_30px_rgb(0,77,95,0.06)] border border-[#E2E8F0] overflow-hidden">
          <div className="p-8 md:p-10 flex flex-col gap-6">

            {/* Progress */}
            <ProgressIndicator
              currentStep={1}
              totalSteps={3}
              title="Create Secure MediChain Account"
              subtitle="Securely register to access encrypted healthcare records and identity verification through GPID."
            />

            {/* Role Selector */}
            <RoleSelector role={role} onRoleChange={setRole} />

            {/* Admin note */}
            {role === "admin" && (
            <p
              className="text-[#3f484c] mt-2 text-center italic"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}
            >
              Administrator access is intended for authorized MediChain personnel.
            </p>
            )}
            {/* Form */}
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="relative">
                <input
                  id="full-name"
                  type="text"
                  placeholder=" "
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="peer w-full h-[66px] px-4 pt-6 pb-2 bg-white border border-[#E2E8F0] rounded-[2px] outline-none text-[#101b30] focus:border-[#00677D]"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.6",
                  }}
                />

                <label
                  htmlFor="full-name"
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
                  Full Name
                </label>
              </div>

              {/* Country */}
              <div className="relative">

                <select
                  id="country"
                  value={country}
                  onChange={(e) =>
                    setCountry(
                      e.target.value
                    )
                  }
                  className="
                    peer
                    w-full
                    h-[66px]
                    px-4
                    pt-6
                    pb-2
                    bg-white
                    border
                    border-[#E2E8F0]
                    rounded-[2px]
                    outline-none
                    text-[#101b30]
                    focus:border-[#00677D]
                  "
                  style={{
                    fontFamily:
                      "Inter, sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.6",
                  }}
                >

                  <option
                    value=""
                    hidden
                  >
                  </option>

                  {countries.map(
                    (countryItem) => (

                      <option
                        key={
                          countryItem.value
                        }
                        value={
                          countryItem.value
                        }
                      >

                        {countryItem.label}

                      </option>
                    )
                  )}

                </select>

                <label
                  htmlFor="country"
                  className="
                    absolute left-4
                    pointer-events-none
                    transition-all duration-200
                    text-[#3f484c]

                    peer-focus:top-[10px]
                    peer-focus:text-[12px]
                    peer-focus:text-[#00677D]

                    top-[22px]
                    text-[16px]
                  "
                  style={{
                    fontFamily:
                      "Inter, sans-serif",
                    ...(country && {
                      top: "10px",
                      fontSize: "12px",
                    }),
                  }}
                >

                  Country

                </label>

              </div>

              
              {/* Contact */}
              <div className="relative">
                <input
                  id="contact"
                  type="text"
                  placeholder=" "
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="peer w-full h-[66px] px-4 pt-6 pb-2 bg-white border border-[#E2E8F0] rounded-[2px] outline-none text-[#101b30] focus:border-[#00677D]"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.6",
                  }}
                />

                <label
                  htmlFor="contact"
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
                  Email or Phone Number
                </label>
              </div>

              {/* Doctor Fields */}
              {role === "doctor" && (
                <DoctorFields
                  hospitalName={hospitalName}
                  licenseNumber={licenseNumber}
                  onChange={handleDoctorFieldChange}
                />
              )}

              {error && (

                <p className="text-red-500 text-sm">

                  {error}

                </p>
              )}

              {/* Submit */}
              <button
                className={`mt-4 w-full py-4 rounded transition-all active:scale-[0.98] shadow-md uppercase ${
                  btnState === "sent"
                    ? "bg-[#00A4A6] text-white"
                    : "bg-[#00677D] hover:bg-[#00677d] text-white"
                }`}
                style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, boxShadow: "0 4px 14px rgba(0,103,125,0.2)" }}
                type="submit"
                disabled={btnState === "loading" || btnState === "sent"}
              >
                {btnLabel}
              </button>

              {/* Sign In */}
              <div className="mt-4 text-center">
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: 1.5 }} className="text-[#3f484c]">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#00677D] font-bold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>

            </form>

            {/* Trust Signals */}
            <div className="pt-6 border-t border-[#E2E8F0] flex flex-col gap-3">
              {[
                { icon: "encrypted",     label: "Encrypted Medical Records" },
                { icon: "verified_user", label: "Consent-Based Access" },
                { icon: "history_edu",   label: "Tamper-Protected Audit Trail" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[#00677D] text-[16px] opacity-60 shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                  <span
                    className="text-[#3f484c] tracking-tight leading-none"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", opacity: 0.7 }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* SSL Badge */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e8edff] rounded-full border border-[#E2E8F033]">
                <span
                  className="material-symbols-outlined text-[#00A4A6] text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
                <span
                  className="text-[#3f484c] uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600 }}
                >
                  Secure SSL Session
                </span>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <AuthFooter />

    </div>
  );
}
