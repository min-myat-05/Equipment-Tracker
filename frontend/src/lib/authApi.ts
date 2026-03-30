import axios from "axios";

const envUrl = import.meta.env.VITE_AUTH_API_URL;
const baseURL =
  envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:3000";

const authApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token if present.
authApi.interceptors.request.use(
  (config) => {
    if ((config as any).skipAuth) {
      if (config.headers) {
        delete config.headers.Authorization;
      }
      return config;
    }
    const token =
      localStorage.getItem("token") ?? localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipLog = Boolean((error as any)?.config?.skipGlobalErrorLog);
    if (skipLog) {
      return Promise.reject(error);
    }
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed.";
    if (error.response) {
      console.error(message);
    } else if (error.request) {
      console.error("No response from server");
    } else {
      console.error(message);
    }
    return Promise.reject(error);
  },
);

export default authApi;
