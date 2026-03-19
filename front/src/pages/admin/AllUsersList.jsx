import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Shield, Star, Crown, Edit3, Trash2, X,
  Fingerprint, ShieldAlert, Activity, Zap, Check,
} from "lucide-react";
import "./AllUsersList.scss";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      const data = res.data.data || res.data;
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error("Access Denied", err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = (id) => {
    if (!window.confirm("Terminate personnel access?")) return;
    adminService.deleteUser(id)
      .then(() => setUsers((prev) => prev.filter((u) => u._id !== id)))
      .catch((err) => console.error("Delete Error:", err.message));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      setLoading(true);
      await adminService.updateUser(editingUser._id, { role: editingUser.role });
      setUsers((prev) => prev.map((u) => (u._id === editingUser._id ? editingUser : u)));
      setEditingUser(null);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-page">
      <div className="users-bg-glow" />
      <div className="users-inner">
        <header className="users-header">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="users-control-badge">
              <Zap size={12} className="users-control-badge__icon" />
              <span className="users-control-badge__text">Users List</span>
            </div>
          </motion.div>
        </header>

        <div className="users-grid">
          <AnimatePresence mode="popLayout">
            {users.map((user) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="user-card"
              >
                <div className="user-card__inner">
                  <div className={`user-card__avatar user-card__avatar--${user.role}`}>
                    {user.role === "admin"
                      ? <ShieldAlert size={28} className="user-card__avatar-icon" />
                      : <User size={28} className="user-card__avatar-icon" />}
                  </div>
                  <div className="user-card__info">
                    <div className="user-card__name-row">
                      <h3 className="user-card__name">{user.name}</h3>
                      <span className="user-card__role-badge">{user.role}</span>
                    </div>
                    <p className="user-card__email">{user.email}</p>
                  </div>
                  <div className="user-card__actions">
                    <button onClick={() => setEditingUser(user)} className="user-card__action-btn user-card__action-btn--edit">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => deleteUser(user._id)} className="user-card__action-btn user-card__action-btn--delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {editingUser && (
          <div className="users-modal-overlay">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="users-modal-backdrop"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="users-modal"
            >
              <div className="users-modal__icon-wrap">
                <Fingerprint size={28} />
              </div>
              <h2 className="users-modal__title">
                Role <span>Access</span>
              </h2>
              <p className="users-modal__subtitle">{editingUser.name}</p>

              <button
                type="button"
                onClick={() => setEditingUser({
                  ...editingUser,
                  role: editingUser.role === "user" ? "admin" : "user"
                })}
                className="users-modal__role-switcher"
              >
                <motion.div
                  className="users-modal__role-switcher-bg"
                  animate={{
                    backgroundColor: editingUser.role === "admin"
                      ? "rgba(245, 245, 5, 0.2)"
                      : "rgba(37, 99, 235, 0.2)"
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="users-modal__role-switcher-dot"
                  animate={{
                    x: editingUser.role === "admin" ? 0 : 48,
                    backgroundColor: editingUser.role === "admin" ? "#f5f505" : "#2563eb"
                  }}
                  transition={{ type: "spring", bounce: 0.35, duration: 0.4 }}
                />
                <span className="users-modal__role-switcher-label">
                  {editingUser.role === "user" ? "Switch to Admin" : "Switch to User"}
                </span>
              </button>

              <form onSubmit={handleUpdate} className="users-modal__form">
                <button type="submit" disabled={loading} className="users-modal__submit-btn">
                  {loading ? <Activity size={18} style={{ animation: "spin 1s linear infinite" }} /> : "Commit Security Update"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
