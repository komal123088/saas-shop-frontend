import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

// const SHOP_API = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleSessionExpiry = (event) => {
      if (event.detail?.sessionExpired || event.detail?.tokenInvalid) {
        logout();
        alert("Your session has expired. Please login again.");
      }
    };
    window.addEventListener("sessionExpired", handleSessionExpiry);
    return () =>
      window.removeEventListener("sessionExpired", handleSessionExpiry);
  }, []);

  // ── Login — tenantId bhi save karo ──
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    // tenantId user object mein hoga
    if (userData.tenantId) {
      localStorage.setItem("tenantId", userData.tenantId);
    }
    setUser(userData);
    redirectAfterLogin(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tenantId");
    setUser(null);
    navigate("/login");
  };

  const redirectAfterLogin = (userData) => {
    if (userData.isOwner) {
      navigate("/shop");
    } else if (userData.role === "cashier") {
      navigate("/shop/sales/pos");
    } else if (userData.role === "stock_keeper") {
      navigate("/shop/products");
    } else if (userData.role === "manager") {
      navigate("/shop");
    }
  };
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getTenantId = () => localStorage.getItem("tenantId");

  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (response.status === 401) {
      const data = await response.json();
      if (data.sessionExpired || data.tokenInvalid) {
        logout();
        throw new Error("Session expired. Please login again.");
      }
    }

    return response;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    getAuthHeader,
    apiCall,
    getTenantId,
    tenantId: user?.tenantId || localStorage.getItem("tenantId"),
    isOwner: user?.isOwner || false,
    isManager: user?.role === "manager",
    isCashier: user?.role === "cashier",
    isStockKeeper: user?.role === "stock_keeper",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
