import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminAuthContext = createContext(null);

const SAAS_API = `${import.meta.env.VITE_REACT_BACKEND_BASE}/saas`;

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const adminData = localStorage.getItem("admin_user");
    if (token && adminData) {
      setAdmin(JSON.parse(adminData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${SAAS_API}/auth/login`, { email, password });
    const { token, admin: adminData } = res.data;

    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(adminData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setAdmin(adminData);
    navigate("/admin");
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    delete axios.defaults.headers.common["Authorization"];
    setAdmin(null);
    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context)
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
};
