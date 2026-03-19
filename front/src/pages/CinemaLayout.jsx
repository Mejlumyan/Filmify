import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  Home,
  Film,
  LogOut,
  Settings,
  X,
  Palette,
  Sun,
  Moon,
  Wallet,
  Clock,
  Shield,
  Search as SearchIcon,
  Lock,
} from "lucide-react";
import { authService } from "../services/authService";
import { ScrollToTop } from "../components/ScrollToTop";
import { ChangePassword } from "./auth/ChangePassword/ChangePassword";
import { Footer } from "../components/Footer";
import { Search } from "./menu/movie/Search";
import "./CinemaLayout.scss";

export const CinemaLayout = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState(0);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") !== "light",
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const updateUserData = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role === "admin");
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserName(user.name || "Guest");
          setBalance(user.balance || 0);
        }
        authService.getUser().then((res) => {
          const freshData = res.data.data || res.data;
          setUserName(freshData.name);
          setBalance(freshData.balance);
          localStorage.setItem("user", JSON.stringify(freshData));
        });
      } catch (error) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    updateUserData();
    window.addEventListener("storage", updateUserData);
    return () => window.removeEventListener("storage", updateUserData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="cinema-layout">
      <ScrollToTop />
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="settings-overlay"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="settings-drawer"
            >
              <header className="settings-header">
                <div className="settings-header__left">
                  <div className="settings-header__icon-wrap">
                    <Settings size={20} className="settings-header__icon" />
                  </div>
                  <h3 className="settings-header__title">Settings</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSettingsOpen(false)}
                  className="settings-header__close"
                >
                  <X size={20} />
                </motion.button>
              </header>

              <div className="settings-body">
                <div className="settings-section">
                  <div className="settings-section__label">
                    <Palette size={14} />
                    <p>Appearance</p>
                  </div>
                  <div className="theme-toggle">
                    <motion.div
                      layout
                      className="theme-toggle__slider"
                      animate={{ x: isDark ? "calc(100%)" : "0%" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setIsDark(false)}
                      className="theme-toggle__button"
                    >
                      <Sun size={16} className={isDark ? "inactive" : ""} />
                      Light
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setIsDark(true)}
                      className="theme-toggle__button"
                    >
                      <Moon size={16} className={!isDark ? "inactive" : ""} />
                      Dark
                    </motion.button>
                  </div>
                </div>

                <div className="settings-section">
                  <div className="settings-section__label">
                    <Lock size={14} />
                    <p>Security</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(245,245,5,0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="settings-security-button"
                  >
                    <Lock size={16} />
                    <span>Change Password</span>
                  </motion.button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(245,245,5,0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="settings-logout"
              >
                <LogOut size={18} />
                <span className="settings-logout__label">Logout</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <header className="cinema-header">
        {!isSearchOpen && (
          <nav className="cinema-nav">
            <TopNavLink
              to="/"
              icon={<Home size={18} />}
              label="Home"
              active={location.pathname === "/"}
            />
            <TopNavLink
              to="/movies"
              icon={<Film size={18} />}
              label="Movies"
              active={location.pathname === "/movies"}
            />
            <TopNavLink
              to="/calendar"
              icon={<Clock size={18} />}
              label="Schedule"
              active={location.pathname === "/calendar"}
            />
            <TopNavLink
              to="/profile/payments"
              icon={<Wallet size={18} />}
              label="History"
              active={location.pathname === "/profile/payments"}
            />
            {isAdmin && (
              <TopNavLink
                to="/admin/add-movie"
                icon={<Shield size={18} />}
                label="Admin"
                active={location.pathname.startsWith("/admin")}
              />
            )}
          </nav>
        )}

        <Link to="/" className="cinema-logo">
          <motion.h1
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="cinema-logo__film">FILM</span><span className="cinema-logo__ify">IFY</span>
          </motion.h1>
        </Link>

        <div className="cinema-header__right">
          {isSearchOpen ? (
            <>
              <Search />
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsSearchOpen(false)}
                className="header-btn header-btn--close-search"
              >
                <X size={18} />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="header-btn header-btn--search"
              >
                <SearchIcon size={18} />
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="balance-card"
                onClick={() => navigate("/profile/payments")}
              >
                <div className="balance-card__icon-wrap">
                  <Wallet size={16} className="balance-card__icon" />
                </div>
                <div className="balance-card__content">
                  <span className="balance-card__label">Balance</span>
                  <span className="balance-card__amount">
                    {balance.toLocaleString()} <span className="balance-card__currency">AMD</span>
                  </span>
                </div>
              </motion.div>

              <div className="header-divider" />

              <div className="user-profile">
                <div className="user-profile__info">
                  <span className="user-profile__role">{isAdmin ? "Admin" : "User"}</span>
                  <span className="user-profile__name">{userName || "Guest"}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSettingsOpen(true)}
                className="header-btn header-btn--settings"
              >
                <Settings size={18} />
              </motion.button>
            </>
          )}
        </div>
      </header>

      <main className="cinema-main">
        <div className="cinema-main__scroll">
          <Outlet />
        </div>
      </main>

      <ChangePassword
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <Footer />
    </div>
  );
};

const TopNavLink = ({ to, icon, label, active = false }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ y: -3, color: "#f5f505" }}
      whileTap={{ scale: 0.95 }}
      className={`nav-link${active ? " nav-link--active" : ""}`}
    >
      <span className="nav-link__icon">{icon}</span>
      <span className="nav-link__label">{label}</span>
    </motion.div>
  </Link>
);
