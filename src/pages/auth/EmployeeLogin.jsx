import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Building2,
  ArrowRight,
  UserCheck,
} from "lucide-react";

const SHOP_API = `${import.meta.env.VITE_REACT_BACKEND_BASE}`;

const EmployeeLogin = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    tenantId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password || !form.tenantId)
      return setError("Please fill all fields — Tenant ID is required");
    setLoading(true);
    try {
      const res = await axios.post(`${SHOP_API}/auth/employee/login`, {
        username: form.username,
        password: form.password,
        tenantId: form.tenantId,
      });
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800&family=Outfit:wght@400;500;600;700&display=swap');

        .el-wrap {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f4f5f9 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; font-family: 'Outfit', sans-serif;
        }
        .el-bg-circle1 {
          position: fixed; top: -80px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .el-bg-circle2 {
          position: fixed; bottom: -60px; left: -60px;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .el-card {
          background: #fff; border: 1px solid #e2e5ed;
          border-radius: 20px; padding: 40px 36px;
          width: 100%; max-width: 420px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
          animation: cardIn 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .el-header { text-align: center; margin-bottom: 28px; }
        .el-logo {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #0d9488, #14b8a6);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          box-shadow: 0 6px 20px rgba(13,148,136,0.3);
        }
        .el-title {
          font-family: 'Fraunces', serif;
          font-size: 22px; font-weight: 800;
          color: #111827; letter-spacing: -0.4px; margin-bottom: 5px;
        }
        .el-subtitle { font-size: 13px; color: #9ca3af; font-weight: 500; }

        .el-error {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 11px 14px; border-radius: 10px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #b91c1c; font-size: 13px; font-weight: 500;
          margin-bottom: 18px; line-height: 1.5;
        }
        .el-error-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ef4444; flex-shrink: 0; margin-top: 5px;
        }

        .el-form { display: flex; flex-direction: column; gap: 16px; }
        .el-field { display: flex; flex-direction: column; gap: 5px; }
        .el-label { font-size: 12.5px; font-weight: 600; color: #374151; }

        .el-input-wrap { position: relative; }
        .el-input-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; pointer-events: none;
        }
        .el-input {
          width: 100%; padding: 11px 12px 11px 36px;
          border: 1.5px solid #e2e5ed; border-radius: 10px;
          font-size: 14px; font-family: 'Outfit', sans-serif;
          color: #111827; background: #fafafa;
          outline: none; transition: all 0.15s;
        }
        .el-input::placeholder { color: #d1d5db; }
        .el-input:focus {
          border-color: #0d9488; background: #fff;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
        }
        .el-hint {
          display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; color: #9ca3af; margin-top: 3px;
        }
        .el-hint-dot { width: 4px; height: 4px; border-radius: 50%; background: #d1d5db; flex-shrink: 0; }

        .el-eye-btn {
          position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
          width: 28px; height: 28px; border: none; background: transparent;
          color: #9ca3af; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px; transition: all 0.13s;
        }
        .el-eye-btn:hover { background: #f3f4f6; color: #374151; }

        .el-submit {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px; border-radius: 11px; border: none;
          background: linear-gradient(135deg, #0d9488, #0891b2);
          color: #fff; font-size: 14.5px; font-weight: 700;
          font-family: 'Outfit', sans-serif; cursor: pointer;
          transition: all 0.15s; box-shadow: 0 4px 14px rgba(13,148,136,0.3);
          letter-spacing: 0.2px;
        }
        .el-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(13,148,136,0.4);
        }
        .el-submit:active:not(:disabled) { transform: translateY(0); }
        .el-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .el-spin {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .el-footer-note {
          text-align: center; margin-top: 20px;
          font-size: 11.5px; color: #d1d5db;
        }
      `}</style>

      <div className="el-wrap">
        <div className="el-bg-circle1" />
        <div className="el-bg-circle2" />

        <div className="el-card">
          <div className="el-header">
            <div className="el-logo">
              <UserCheck size={26} color="#fff" strokeWidth={2.5} />
            </div>
            <div className="el-title">Employee Login</div>
            <div className="el-subtitle">Sign in to access your account</div>
          </div>

          {error && (
            <div className="el-error">
              <div className="el-error-dot" />
              {error}
            </div>
          )}

          <form className="el-form" onSubmit={handleSubmit}>
            <div className="el-field">
              <label className="el-label">Tenant ID *</label>
              <div className="el-input-wrap">
                <Building2 size={15} className="el-input-icon" />
                <input
                  className="el-input"
                  type="text"
                  placeholder="tenant_1234567890"
                  value={form.tenantId}
                  onChange={(e) => set("tenantId", e.target.value)}
                />
              </div>
              <div className="el-hint">
                <div className="el-hint-dot" />
                Ask your shop owner for the Tenant ID
              </div>
            </div>

            <div className="el-field">
              <label className="el-label">Username *</label>
              <div className="el-input-wrap">
                <User size={15} className="el-input-icon" />
                <input
                  className="el-input"
                  type="text"
                  placeholder="your_username"
                  value={form.username}
                  onChange={(e) => set("username", e.target.value)}
                />
              </div>
            </div>

            <div className="el-field">
              <label className="el-label">Password *</label>
              <div className="el-input-wrap">
                <Lock size={15} className="el-input-icon" />
                <input
                  className="el-input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  style={{ paddingRight: "42px" }}
                  onChange={(e) => set("password", e.target.value)}
                />
                <button
                  type="button"
                  className="el-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="el-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="el-spin" /> Signing in...
                </>
              ) : (
                <>
                  <UserCheck size={15} /> Sign In <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="el-footer-note">
            Contact your shop owner if you have trouble signing in
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeLogin;
