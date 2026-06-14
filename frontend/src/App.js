// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage    from "./pages/LandingPage";
import SendOtpPage    from "./pages/SendOtpPage";
import VerifyOtpPage  from "./pages/VerifyOtpPage";
import SetPinPage     from "./pages/SetPinPage";
import LoginPage      from "./pages/LoginPage";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard  from "./pages/doctor/DoctorDashboard";
import AdminDashboard   from "./pages/admin/AdminDashboard";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("accessToken");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
      <Routes>
        {/* Landing page — public */}
        <Route path="/"            element={<LandingPage />} />

        {/* Auth */}
        <Route path="/register"    element={<SendOtpPage />} />
        <Route path="/send-otp"    element={<SendOtpPage />} />
        <Route path="/verify-otp"  element={<VerifyOtpPage />} />
        <Route path="/set-pin"     element={<SetPinPage />} />
        <Route path="/login"       element={<LoginPage />} />

        {/* Protected portals */}
        <Route path="/patient/*" element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/*" element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
  );
}
