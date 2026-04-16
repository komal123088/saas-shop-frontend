import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_BACKEND_BASE}/saas`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token"); // ← fixed
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("admin_token"); // ← fixed
      window.location.href = "/admin/login"; // ← fixed
    }
    return Promise.reject(err);
  },
);

// Auth
export const login = (data) => API.post("/auth/login", data);
export const registerAdmin = (data) => API.post("/auth/register", data);

// Analytics
export const getAnalytics = () => API.get("/analytics");

// Tenants
export const getTenants = (params) => API.get("/tenants", { params });
export const getTenant = (id) => API.get(`/tenants/${id}`);
export const createTenant = (data) => API.post("/tenants", data);
export const updateTenantStatus = (id, status) =>
  API.patch(`/tenants/${id}/status`, { status });
export const extendTenantPlan = (id, months) =>
  API.patch(`/tenants/${id}/extend`, { months });
export const deleteTenant = (id) => API.delete(`/tenants/${id}`);

// Plans
export const getPlans = () => API.get("/plans");
export const updatePlan = (id, data) => API.put(`/plans/${id}`, data);
export const seedPlans = () => API.post("/plans/seed");
