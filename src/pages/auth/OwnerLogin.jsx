import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Store,
  Building2,
  ArrowRight,
  Users,
} from "lucide-react";

const SHOP_API = `${import.meta.env.VITE_REACT_BACKEND_BASE}`;

const OwnerLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", tenantId: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password || !form.tenantId) {
      return setError("Please fill all fields — Tenant ID is required");
    }
    setLoading(true);
    try {
      const res = await axios.post(`${SHOP_API}/auth/owner/login`, {
        email: form.email,
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

        .ol-wrap {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f4f5f9 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          font-family: 'Outfit', sans-serif;
        }

        .ol-bg-circle1 {
          position: fixed; top: -80px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .ol-bg-circle2 {
          position: fixed; bottom: -60px; left: -60px;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .ol-card {
          background: #fff;
          border: 1px solid #e2e5ed;
          border-radius: 20px;
          padding: 40px 36px;
          width: 100%; max-width: 420px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
          animation: cardIn 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* HEADER */
        .ol-header { text-align: center; margin-bottom: 28px; }
        .ol-logo {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #0d9488, #14b8a6);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          box-shadow: 0 6px 20px rgba(13,148,136,0.3);
        }
        .ol-title {
          font-family: 'Fraunces', serif;
          font-size: 22px; font-weight: 800;
          color: #111827; letter-spacing: -0.4px;
          margin-bottom: 5px;
        }
        .ol-subtitle { font-size: 13px; color: #9ca3af; font-weight: 500; }

        /* ERROR */
        .ol-error {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 11px 14px; border-radius: 10px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #b91c1c; font-size: 13px; font-weight: 500;
          margin-bottom: 18px; line-height: 1.5;
        }
        .ol-error-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ef4444; flex-shrink: 0; margin-top: 5px;
        }

        /* FORM */
        .ol-form { display: flex; flex-direction: column; gap: 16px; }

        .ol-field { display: flex; flex-direction: column; gap: 5px; }
        .ol-label { font-size: 12.5px; font-weight: 600; color: #374151; }

        .ol-input-wrap { position: relative; }
        .ol-input-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; pointer-events: none;
        }
        .ol-input {
          width: 100%;
          padding: 11px 12px 11px 36px;
          border: 1.5px solid #e2e5ed;
          border-radius: 10px;
          font-size: 14px; font-family: 'Outfit', sans-serif;
          color: #111827; background: #fafafa;
          outline: none; transition: all 0.15s;
        }
        .ol-input::placeholder { color: #d1d5db; }
        .ol-input:focus {
          border-color: #0d9488;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
        }

        .ol-hint {
          display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; color: #9ca3af; margin-top: 3px;
        }
        .ol-hint-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #d1d5db; flex-shrink: 0;
        }

        .ol-eye-btn {
          position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
          width: 28px; height: 28px;
          border: none; background: transparent;
          color: #9ca3af; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px; transition: all 0.13s;
        }
        .ol-eye-btn:hover { background: #f3f4f6; color: #374151; }

        .ol-forgot {
          display: block; text-align: right;
          font-size: 11.5px; font-weight: 600;
          color: #0d9488; text-decoration: none;
          margin-top: 5px; transition: color 0.13s;
        }
        .ol-forgot:hover { color: #0f766e; }

        /* DIVIDER */
        .ol-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 4px 0;
        }
        .ol-divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .ol-divider-text { font-size: 11px; color: #d1d5db; font-weight: 500; }

        /* SUBMIT */
        .ol-submit {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px;
          border-radius: 11px; border: none;
          background: linear-gradient(135deg, #0d9488, #0891b2);
          color: #fff;
          font-size: 14.5px; font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer; transition: all 0.15s;
          box-shadow: 0 4px 14px rgba(13,148,136,0.3);
          letter-spacing: 0.2px;
        }
        .ol-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(13,148,136,0.4);
        }
        .ol-submit:active:not(:disabled) { transform: translateY(0); }
        .ol-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        /* EMPLOYEE LINK */
        .ol-emp-link {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          margin-top: 18px; padding: 11px;
          border: 1.5px solid #e2e5ed; border-radius: 11px;
          background: #fafafa;
          color: #374151; text-decoration: none;
          font-size: 13.5px; font-weight: 600;
          transition: all 0.15s;
        }
        .ol-emp-link:hover {
          border-color: #0d9488; color: #0d9488;
          background: #f0fdfa;
        }

        /* SPINNER */
        .ol-spin {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .ol-footer-note {
          text-align: center; margin-top: 16px;
          font-size: 11.5px; color: #d1d5db;
        }
      `}</style>

      <div className="ol-wrap">
        <div className="ol-bg-circle1" />
        <div className="ol-bg-circle2" />

        <div className="ol-card">
          {/* Header */}
          <div className="ol-header">
            <div className="ol-logo">
              <Store size={26} color="#fff" strokeWidth={2.5} />
            </div>
            <div className="ol-title">Owner Login</div>
            <div className="ol-subtitle">Sign in to manage your shop</div>
          </div>

          {/* Error */}
          {error && (
            <div className="ol-error">
              <div className="ol-error-dot" />
              {error}
            </div>
          )}

          <form className="ol-form" onSubmit={handleSubmit}>
            {/* Tenant ID */}
            <div className="ol-field">
              <label className="ol-label">Tenant ID *</label>
              <div className="ol-input-wrap">
                <Building2 size={15} className="ol-input-icon" />
                <input
                  className="ol-input"
                  type="text"
                  placeholder="tenant_1234567890"
                  value={form.tenantId}
                  onChange={(e) => set("tenantId", e.target.value)}
                />
              </div>
              <div className="ol-hint">
                <div className="ol-hint-dot" />
                You can find this in your approval email
              </div>
            </div>

            {/* Email */}
            <div className="ol-field">
              <label className="ol-label">Email Address *</label>
              <div className="ol-input-wrap">
                <Mail size={15} className="ol-input-icon" />
                <input
                  className="ol-input"
                  type="email"
                  placeholder="owner@email.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="ol-field">
              <label className="ol-label">Password *</label>
              <div className="ol-input-wrap">
                <Lock size={15} className="ol-input-icon" />
                <input
                  className="ol-input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  style={{ paddingRight: "42px" }}
                  onChange={(e) => set("password", e.target.value)}
                />
                <button
                  type="button"
                  className="ol-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <Link to="/forgot-password" className="ol-forgot">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="ol-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="ol-spin" /> Signing in...
                </>
              ) : (
                <>
                  <Store size={15} /> Sign In to Shop <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="ol-divider" style={{ marginTop: 20 }}>
            <div className="ol-divider-line" />
            <span className="ol-divider-text">OR</span>
            <div className="ol-divider-line" />
          </div>

          <Link to="/employee-login" className="ol-emp-link">
            <Users size={15} /> Employee Login <ArrowRight size={13} />
          </Link>

          <div className="ol-footer-note">
            Don't have an account? Contact your administrator
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerLogin;
