import { Axios } from "../config/axios";

export const authService = {
  getUser: async () => {
    const res = await Axios.get("/auth/user");
    return res;
  },

  register: async (userData) => {
    const res = await Axios.post("/auth/register", userData);
    return res;
  },

  login: async (email, password) => {
    const res = await Axios.post("/auth/login", { email, password });
    return res;
  },

  googleLogin: async (token) => {
    const res = await Axios.post("/auth/google-login", { token });
    return res;
  },

  forgotPassword: async (email) => {
    const res = await Axios.post("/auth/forgot-password", { email });
    return res;
  },

  verifyResetCode: async (email, resetCode) => {
    const res = await Axios.post("/auth/verify-reset-code", { email, resetCode });
    return res;
  },

  resetPassword: async (email, resetCode, newPassword) => {
    const res = await Axios.post("/auth/reset-password", { email, resetCode, newPassword });
    return res;
  },

  changePassword: async (oldPassword, newPassword) => {
    const res = await Axios.post("/auth/change-password", { oldPassword, newPassword });
    return res;
  },
};

