import axios from "axios";

// Get the current hostname (IP or localhost)
const getCurrentHost = () => {
  return window.location.hostname;
};

// Detect if running inside Electron
const isElectron = window.location.protocol === "file:";

const getBackendURL = () => {
  const currentHost = getCurrentHost();

  console.log("📍 Current host:", currentHost);
  console.log("📍 Is Electron:", isElectron);

  if (isElectron) {
    // Electron desktop app
    return "http://127.0.0.1:3000/api";
  }

  // If accessing from another device (mobile)
  if (currentHost !== "localhost" && currentHost !== "127.0.0.1") {
    console.log("📱 Mobile/LAN access detected");
    return `http://${currentHost}:3000/api`;
  }

  // Local development
  return "http://127.0.0.1:3000/api";
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

// Add request interceptor
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

// Add response interceptor
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
      console.error(
        "   Check if backend is running and firewall allows port 3000",
      );
    } else {
      console.error("❌ Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
