import React, { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, Shield, Zap } from "lucide-react";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Fill all fields");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800&family=Outfit:wght@400;500;600;700&display=swap');

        .al-wrap {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f4f5f9 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          font-family: 'Outfit', sans-serif;
        }

        /* BG DECORATION */
        .al-bg-circle1 {
          position: fixed; top: -80px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .al-bg-circle2 {
          position: fixed; bottom: -60px; left: -60px;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        /* CARD */
        .al-card {
          background: #fff;
          border: 1px solid #e2e5ed;
          border-radius: 20px;
          padding: 40px 36px;
          width: 100%; max-width: 400px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
          position: relative;
          animation: cardIn 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* HEADER */
        .al-header { text-align: center; margin-bottom: 32px; }

        .al-logo {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #0d9488, #14b8a6);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 6px 20px rgba(13,148,136,0.3);
        }

        .al-brand {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          margin-bottom: 6px;
        }
        .al-brand-name {
          font-family: 'Fraunces', serif;
          font-size: 22px; font-weight: 800;
          color: #111827; letter-spacing: -0.4px;
        }

        .al-subtitle {
          font-size: 13px; color: #9ca3af; font-weight: 500;
        }

        .al-badge {
          display: inline-flex; align-items: center; gap: 5px;
          margin-top: 10px;
          padding: 4px 12px; border-radius: 99px;
          background: #f0fdfa; border: 1px solid #99f6e4;
          font-size: 11.5px; font-weight: 600; color: #0f766e;
        }

        /* FORM */
        .al-form { display: flex; flex-direction: column; gap: 18px; }

        .al-field { display: flex; flex-direction: column; gap: 6px; }
        .al-label { font-size: 12.5px; font-weight: 600; color: #374151; }

        .al-input-wrap { position: relative; }
        .al-input-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; pointer-events: none;
        }
        .al-input {
          width: 100%;
          padding: 11px 12px 11px 36px;
          border: 1.5px solid #e2e5ed;
          border-radius: 10px;
          font-size: 14px; font-family: 'Outfit', sans-serif;
          color: #111827; background: #fafafa;
          outline: none; transition: all 0.15s;
        }
        .al-input::placeholder { color: #d1d5db; }
        .al-input:focus {
          border-color: #0d9488;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
        }

        .al-eye-btn {
          position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
          width: 28px; height: 28px;
          border: none; background: transparent;
          color: #9ca3af; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px; transition: all 0.13s;
        }
        .al-eye-btn:hover { background: #f3f4f6; color: #374151; }

        /* SUBMIT */
        .al-submit {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px;
          border-radius: 11px; border: none;
          background: linear-gradient(135deg, #0d9488, #0891b2);
          color: #fff;
          font-size: 14.5px; font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer; transition: all 0.15s;
          box-shadow: 0 4px 14px rgba(13,148,136,0.3);
          margin-top: 4px;
          letter-spacing: 0.2px;
        }
        .al-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(13,148,136,0.4);
        }
        .al-submit:active:not(:disabled) { transform: translateY(0); }
        .al-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        /* SPINNER */
        .al-spin {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* FOOTER NOTE */
        .al-footer-note {
          text-align: center; margin-top: 20px;
          font-size: 11.5px; color: #d1d5db;
        }
      `}</style>

      <div className="al-wrap">
        <div className="al-bg-circle1" />
        <div className="al-bg-circle2" />

        <div className="al-card">
          {/* Header */}
          <div className="al-header">
            <div className="al-logo">
              <Zap size={26} color="#fff" strokeWidth={2.5} />
            </div>
            <div className="al-brand">
              <span className="al-brand-name">ShopSaaS</span>
            </div>
            <div className="al-subtitle">Admin Control Panel</div>
            <div className="al-badge">
              <Shield size={11} /> Super Admin Access Only
            </div>
          </div>

          {/* Form */}
          <form className="al-form" onSubmit={handleSubmit}>
            <div className="al-field">
              <label className="al-label">Email Address</label>
              <div className="al-input-wrap">
                <Mail size={15} className="al-input-icon" />
                <input
                  className="al-input"
                  type="email"
                  placeholder="admin@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="al-field">
              <label className="al-label">Password</label>
              <div className="al-input-wrap">
                <Lock size={15} className="al-input-icon" />
                <input
                  className="al-input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  style={{ paddingRight: "42px" }}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
                <button
                  type="button"
                  className="al-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="al-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="al-spin" /> Logging in...
                </>
              ) : (
                <>
                  <Shield size={15} /> Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="al-footer-note">
            Authorized personnel only — all access is logged
          </div>
        </div>
      </div>
    </>
  );
}
