import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:7777`;

export const Axios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  config.params = {
    ...config.params,
    lang: "en",
    _cache: Date.now(),
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
