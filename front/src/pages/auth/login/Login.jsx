import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ChevronRight, AlertCircle } from "lucide-react";
import { authService } from "../../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { ForgotPassword } from "../ForgotPassword/ForgotPassword";
import "./Login.scss";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const cinemaBackground =
    "https://open-stand.org/wp-content/uploads/2016/04/International-Union-of-Cinemas-Calls-for-Open-Standards-in-the-Cinema-Industry.jpg";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setError("");
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      localStorage.setItem("accessToken", response.data.accessToken);
      window.location.href = "/";
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Invalid credentials";
      setError(errorMessage);

      if (
        errorMessage.toLowerCase().includes("locked") ||
        errorMessage.toLowerCase().includes("blocked")
      ) {
        setIsLocked(true);
        setTimeout(() => setIsLocked(false), 180000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");

      const res = await authService.googleLogin(
        credentialResponse.credential,
      );

      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <img
          src={cinemaBackground}
          className="login-background__image"
          alt="Cinema background"
        />
        <div className="login-background__overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-wrapper"
      >
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-header__title">
              FILM<span className="login-header__title--highlight">IFY</span>
            </h1>
            <p className="login-header__subtitle">
              Just Enjoy the Show
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`login-error${isLocked ? " login-error--locked" : ""}`}
                >
                  <AlertCircle size={16} />
                  <span style={{ flex: 1 }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="login-inputs">
              <div className="input-group">
                <Mail className="input-group__icon" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLocked}
                  className="input-group__field"
                  placeholder="email"
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-group__icon" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked}
                  className="input-group__field"
                  placeholder="password"
                  required
                />
              </div>

              <button
                type="button"
                className="login-forgot-password"
                onClick={() => setIsForgotPasswordOpen(true)}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className={`login-submit${isLocked ? " login-submit--locked" : ""}`}
            >
              {isLocked
                ? "locked_account"
                : loading
                ? "Entering..."
                : "login"}
              {!loading && !isLocked && <ChevronRight size={20} />}
            </button>
          </form>

          <div className="login-divider">
            <div className="login-divider__line">
              <div />
            </div>
          </div>

          <div className="login-google">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
              theme="filled_black"
              shape="pill"
              width="320"
            />
          </div>

          <div className="login-footer">
            <Link to="/register" className="login-footer__link">
              have no account?
              <span className="login-footer__link--highlight">
                Join us
              </span>
            </Link>
          </div>

          <ForgotPassword
            isOpen={isForgotPasswordOpen}
            onClose={() => setIsForgotPasswordOpen(false)}
            onSuccess={() => {
              setEmail("");
              setPassword("");
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
