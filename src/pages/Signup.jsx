import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import { requestSignup, verifyOtp } from "../api/auth";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await requestSignup(form);
      setOtpSent(true);
      alert("OTP sent to your email. Please verify.");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({ email: form.email, otp });
      alert("Email verified successfully! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{otpSent ? "Verify OTP" : "Signup"}</h2>

        {!otpSent ? (
          <form onSubmit={handleSignup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="auth-input"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              className="auth-input"
              value={form.password}
              onChange={handleChange}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="auth-input"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <button className="auth-btn" type="submit">Create Account</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <label>Enter OTP</label>
            <input
              type="text"
              name="otp"
              className="auth-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button className="auth-btn" type="submit">Verify OTP</button>
          </form>
        )}

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
