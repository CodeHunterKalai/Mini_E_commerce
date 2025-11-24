import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/auth";
import "../styles/auth.css";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.email) {
    // Use useEffect to avoid side-effects during render, or just return null and navigate in useEffect
    // For simplicity in this existing structure, we'll just return early if no email, 
    // but ideally this should be handled better. 
    // Let's just render a message or redirect.
    return <div className="auth-container"><p>Error: No email provided. Please signup first.</p></div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await verifyOtp({ email: state.email, otp });

      // Check for various success indicators
      if (response === "Signup successful" || response.message === "Signup successful" || response.success) {
        alert("Account verified successfully! Please login.");
        navigate("/login");
      } else {
        alert(response.message || response || "Verification failed");
      }
    } catch (error) {
      console.error("OTP Verification error:", error);
      alert("An error occurred during verification.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Verify OTP</h2>
        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>Enter the OTP sent to {state.email}</p>
        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button className="auth-btn">Verify</button>
        </form>
      </div>
    </div>
  );
}
