import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { authService } from "../../../services/authService";
import { toast } from "react-hot-toast";
import "./ForgotPassword.scss";

export const ForgotPassword = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success("Reset code sent to your email!");
      setStep("code");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset code");
      toast.error("Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!resetCode) {
      setError("Please enter the reset code");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await authService.verifyResetCode(email, resetCode);
      setStep("password");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Please enter both passwords");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await authService.resetPassword(email, resetCode, newPassword);
      toast.success("Password reset successfully!");
      handleClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="forgot-password-overlay" onClick={handleClose}>
          <motion.div
            className="forgot-password-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="forgot-password-header">
              {step !== "email" && (
                <button
                  className="forgot-password-back"
                  onClick={() => {
                    if (step === "code") setStep("email");
                    if (step === "password") setStep("code");
                    setError("");
                  }}
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 className="forgot-password-title">Reset Password</h2>
              <button className="forgot-password-close" onClick={handleClose}>
                ✕
              </button>
            </div>

            <div className="forgot-password-content">
              {error && (
                <motion.div
                  className="forgot-password-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}

              {step === "email" && (
                <motion.form
                  key="email"
                  onSubmit={handleSendCode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="forgot-password-description">
                    Enter your email address and we'll send you a code to reset your password.
                  </div>

                  <div className="forgot-password-field">
                    <label>Email Address</label>
                    <div className="forgot-password-input-wrap">
                      <Mail size={20} />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="forgot-password-button"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Code"}
                  </button>
                </motion.form>
              )}

              {step === "code" && (
                <motion.form
                  key="code"
                  onSubmit={handleVerifyCode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="forgot-password-description">
                    Enter the code we sent to <strong>{email}</strong>
                  </div>

                  <div className="forgot-password-field">
                    <label>Reset Code</label>
                    <input
                      type="text"
                      placeholder="000000"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                      disabled={loading}
                      maxLength="6"
                      className="forgot-password-code-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="forgot-password-button"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                </motion.form>
              )}

              {step === "password" && (
                <motion.form
                  key="password"
                  onSubmit={handleResetPassword}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="forgot-password-success-badge">
                    <CheckCircle size={24} />
                    <span>Code Verified!</span>
                  </div>

                  <div className="forgot-password-field">
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="forgot-password-field">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="forgot-password-button"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </motion.form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
