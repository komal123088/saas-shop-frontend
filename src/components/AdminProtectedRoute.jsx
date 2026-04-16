import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#060610",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            border: "3px solid transparent",
            borderTopColor: "#6c63ff",
            borderRadius: "50%",
            animation: "spin .6s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;
