import axios from "axios";

const getBackendURL = () => {
  // Production (Vercel) - environment variable set hai
  if (import.meta.env.VITE_REACT_BACKEND_BASE) {
    return import.meta.env.VITE_REACT_BACKEND_BASE;
  }

  // Local development - hostname se detect karo
  const host = window.location.hostname;
  if (host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:3000/api`; // LAN/mobile access
  }

  return "http://127.0.0.1:3000/api"; // localhost
};

const API_URL = getBackendURL();
console.log("🌍 API Base URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("❌ Request timeout");
    } else if (error.response) {
      console.error(`❌ ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("❌ No response - backend may not be accessible");
    } else {
      console.error("❌ Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
