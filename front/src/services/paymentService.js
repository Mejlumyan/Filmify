import { Axios } from "../config/axios";

export const paymentService = {
  processPayment: async (data) => {
    const res = await Axios.post("/payments/process", data);
    return res;
  },

  depositPayment: async (data) => {
    const res = await Axios.post("/payments/deposit", data);
    return res;
  },

  processStripePayment: async (data) => {
    const res = await Axios.post("/payments/stripe", data);
    return res;
  },

  getPaymentHistory: async (userId) => {
    const res = await Axios.get(`/payments/history/${userId}`);
    return res;
  },
};
