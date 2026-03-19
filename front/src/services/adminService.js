import { Axios } from "../config/axios";

export const adminService = {
  getUsers: async () => {
    const res = await Axios.get("/admin/get-users");
    return res;
  },
  updateUser: async (userId, data) => {
    const res = await Axios.put(`/admin/user/${userId}`, data);
    return res;
  },
  deleteUser: async (userId) => {
    const res = await Axios.delete(`/admin/user/${userId}`);
    return res;
  },
};
