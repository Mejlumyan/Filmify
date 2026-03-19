import "./Admin.scss";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";


export const Admin = () => {
  const location = useLocation();

  return (
    <div className="admin-page">
      <div className="admin-nav">
        <div className="admin-nav__tabs">
          <AdminTab
            to="/admin/add-movie"
            label="Add Movie"
            active={
              location.pathname === "/admin" ||
              location.pathname === "/admin/add-movie"
            }
          />
          <AdminTab
            to="/admin/add-cinema"
            label="Add cinema hall"
            active={location.pathname === "/admin/add-cinema"}
          />
          <AdminTab
            to="/admin/list"
            label="Movies List"
            active={location.pathname === "/admin/list"}
          />
          <AdminTab
            to="/admin/get-users"
            label="All Users"
            active={location.pathname === "/admin/get-users"}
          />
        </div>
      </div>

      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="admin-content"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

const AdminTab = ({ to, label, active }) => (
  <Link to={to} style={{ position: "relative" }}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`admin-tab${active ? " admin-tab--active" : ""}`}
    >
      {active && (
        <motion.div
          layoutId="adminActiveTab"
          className="admin-tab__bg"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="admin-tab__label">{label}</span>
    </motion.div>
  </Link>
);
