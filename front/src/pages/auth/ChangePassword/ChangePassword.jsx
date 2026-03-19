import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, AlertCircle } from "lucide-react";
import { authService } from "../../../services/authService";
import { toast } from "react-hot-toast";
import "./ChangePassword.scss";

export const ChangePassword = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from old password");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      toast.success("Password changed successfully!");
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setShowPassword({ old: false, new: false, confirm: false });
    onClose();
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="change-password-overlay" onClick={handleClose}>
          <motion.div
            className="change-password-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="change-password-header">
              <h2 className="change-password-title">Change Password</h2>
              <button className="change-password-close" onClick={handleClose}>
                ✕
              </button>
            </div>

            <div className="change-password-content">
              {error && (
                <motion.div
                  className="change-password-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="change-password-field">
                  <label>Current Password</label>
                  <div className="change-password-input-group">
                    <input
                      type={showPassword.old ? "text" : "password"}
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="change-password-toggle"
                      onClick={() => togglePasswordVisibility("old")}
                      disabled={loading}
                    >
                      {showPassword.old ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="change-password-field">
                  <label>New Password</label>
                  <div className="change-password-input-group">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="change-password-toggle"
                      onClick={() => togglePasswordVisibility("new")}
                      disabled={loading}
                    >
                      {showPassword.new ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="change-password-field">
                  <label>Confirm New Password</label>
                  <div className="change-password-input-group">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="change-password-toggle"
                      onClick={() => togglePasswordVisibility("confirm")}
                      disabled={loading}
                    >
                      {showPassword.confirm ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="change-password-actions">
                  <button
                    type="button"
                    className="change-password-cancel"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="change-password-submit"
                    disabled={loading}
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
