import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/services";
import Alert from "../components/Alert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const requestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authApi.requestForgetPasswordCode(email);
      setStep(2);
      setSuccess("Code sent to your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authApi.resetForgetPassword({
        email,
        otp,
        password,
        confirmPassword,
      });
      setSuccess("Password reset successfully. You can log in now.");
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Forgot Password?</h2>
      <p className="sub">Reset your password using the code sent to your email.</p>

      <Alert error={error} success={success} />

      {step === 1 && (
        <form onSubmit={requestCode}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn" disabled={loading}>
            {loading ? "Sending..." : "Send Code"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={resetPassword}>
          <label>Verification Code</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className="btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {step === 3 && <Link to="/login">Back to Login</Link>}

      {step !== 3 && (
        <p className="sub" style={{ marginTop: 14 }}>
          <Link to="/login">Back to Login</Link>
        </p>
      )}
    </div>
  );
}