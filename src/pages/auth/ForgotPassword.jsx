import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  KeyRound,
  Lock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_BACKEND_BASE}/auth/owner/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSuccess("Reset code sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_BACKEND_BASE}/auth/owner/verify-reset-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setResetToken(data.resetToken);
      setSuccess("Code verified! Enter your new password.");
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters!");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_BACKEND_BASE}/auth/owner/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetToken, newPassword }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/owner-login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const STEPS = [
    { num: 1, label: "Email" },
    { num: 2, label: "Verify" },
    { num: 3, label: "Reset" },
  ];

  const stepSubtitle = {
    1: "Enter your email to receive a reset code",
    2: "Enter the 6-digit code sent to your email",
    3: "Create your new password",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800&family=Outfit:wght@400;500;600;700&display=swap');

        .fp-wrap {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f4f5f9 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; font-family: 'Outfit', sans-serif;
        }
        .fp-bg1 {
          position: fixed; top: -80px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .fp-bg2 {
          position: fixed; bottom: -60px; left: -60px;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .fp-card {
          background: #fff; border: 1px solid #e2e5ed; border-radius: 20px;
          padding: 40px 36px; width: 100%; max-width: 420px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
          animation: cardIn 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* HEADER */
        .fp-header { text-align: center; margin-bottom: 28px; }
        .fp-logo {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #0d9488, #14b8a6);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          box-shadow: 0 6px 20px rgba(13,148,136,0.3);
        }
        .fp-title {
          font-family: 'Fraunces', serif; font-size: 22px; font-weight: 800;
          color: #111827; letter-spacing: -0.4px; margin-bottom: 5px;
        }
        .fp-subtitle { font-size: 13px; color: #9ca3af; font-weight: 500; }

        /* STEP INDICATOR */
        .fp-steps {
          display: flex; align-items: center;
          margin-bottom: 28px;
        }
        .fp-step-item { display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; }
        .fp-step-circle {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
          border: 2px solid #e2e5ed; background: #fff;
          color: #9ca3af; transition: all 0.2s;
        }
        .fp-step-circle.active { background: #0d9488; border-color: #0d9488; color: #fff; box-shadow: 0 3px 10px rgba(13,148,136,0.3); }
        .fp-step-circle.done { background: #f0fdfa; border-color: #0d9488; color: #0d9488; }
        .fp-step-label { font-size: 11px; font-weight: 600; color: #9ca3af; }
        .fp-step-label.active { color: #0d9488; }
        .fp-step-label.done { color: #0d9488; }
        .fp-step-line { flex: 1; height: 2px; background: #e2e5ed; margin-bottom: 18px; transition: background 0.2s; }
        .fp-step-line.done { background: #0d9488; }

        /* ALERTS */
        .fp-error {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 11px 14px; border-radius: 10px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #b91c1c; font-size: 13px; font-weight: 500;
          margin-bottom: 18px; line-height: 1.5;
        }
        .fp-error-dot { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; flex-shrink: 0; margin-top: 5px; }

        .fp-success {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 11px 14px; border-radius: 10px;
          background: #f0fdf4; border: 1px solid #a7f3d0;
          color: #15803d; font-size: 13px; font-weight: 500;
          margin-bottom: 18px; line-height: 1.5;
        }
        .fp-success-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; flex-shrink: 0; margin-top: 5px; }

        /* FORM */
        .fp-form { display: flex; flex-direction: column; gap: 16px; }
        .fp-field { display: flex; flex-direction: column; gap: 5px; }
        .fp-label { font-size: 12.5px; font-weight: 600; color: #374151; }
        .fp-input-wrap { position: relative; }
        .fp-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
        .fp-input {
          width: 100%; padding: 11px 12px 11px 36px;
          border: 1.5px solid #e2e5ed; border-radius: 10px;
          font-size: 14px; font-family: 'Outfit', sans-serif;
          color: #111827; background: #fafafa; outline: none; transition: all 0.15s;
        }
        .fp-input::placeholder { color: #d1d5db; }
        .fp-input:focus { border-color: #0d9488; background: #fff; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
        .fp-input-center {
          width: 100%; padding: 14px 12px;
          border: 1.5px solid #e2e5ed; border-radius: 10px;
          font-size: 24px; font-weight: 700; font-family: 'Fraunces', serif;
          color: #111827; background: #fafafa; outline: none; transition: all 0.15s;
          text-align: center; letter-spacing: 12px;
        }
        .fp-input-center:focus { border-color: #0d9488; background: #fff; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }

        .fp-hint { font-size: 11.5px; color: #9ca3af; margin-top: 3px; }

        /* BUTTONS */
        .fp-submit {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px; border-radius: 11px; border: none;
          background: linear-gradient(135deg, #0d9488, #0891b2);
          color: #fff; font-size: 14.5px; font-weight: 700;
          font-family: 'Outfit', sans-serif; cursor: pointer;
          transition: all 0.15s; box-shadow: 0 4px 14px rgba(13,148,136,0.3);
        }
        .fp-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(13,148,136,0.4); }
        .fp-submit:active:not(:disabled) { transform: translateY(0); }
        .fp-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .fp-resend {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 10px; border-radius: 10px;
          border: 1.5px solid #e2e5ed; background: #fafafa;
          color: #6b7280; font-size: 13px; font-weight: 600;
          font-family: 'Outfit', sans-serif; cursor: pointer; transition: all 0.14s;
        }
        .fp-resend:hover { border-color: #0d9488; color: #0d9488; background: #f0fdfa; }

        /* BACK LINK */
        .fp-back {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-top: 20px; font-size: 13px; font-weight: 600;
          color: #9ca3af; text-decoration: none; transition: color 0.13s;
        }
        .fp-back:hover { color: #0d9488; }

        /* SPINNER */
        .fp-spin {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="fp-wrap">
        <div className="fp-bg1" />
        <div className="fp-bg2" />

        <div className="fp-card">
          {/* Header */}
          <div className="fp-header">
            <div className="fp-logo">
              <ShieldCheck size={26} color="#fff" strokeWidth={2.5} />
            </div>
            <div className="fp-title">Reset Password</div>
            <div className="fp-subtitle">{stepSubtitle[step]}</div>
          </div>

          {/* Step Indicator */}
          <div className="fp-steps">
            {STEPS.map((s, i) => (
              <>
                <div className="fp-step-item" key={s.num}>
                  <div
                    className={`fp-step-circle ${step === s.num ? "active" : step > s.num ? "done" : ""}`}
                  >
                    {step > s.num ? <CheckCircle size={15} /> : s.num}
                  </div>
                  <span
                    className={`fp-step-label ${step === s.num ? "active" : step > s.num ? "done" : ""}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`fp-step-line ${step > s.num ? "done" : ""}`}
                    key={`line-${i}`}
                  />
                )}
              </>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div className="fp-error">
              <div className="fp-error-dot" /> {error}
            </div>
          )}
          {success && !error && (
            <div className="fp-success">
              <div className="fp-success-dot" /> {success}
            </div>
          )}

          {/* Step 1 — Email */}
          {step === 1 && (
            <form className="fp-form" onSubmit={handleSendCode}>
              <div className="fp-field">
                <label className="fp-label">Email Address</label>
                <div className="fp-input-wrap">
                  <Mail size={15} className="fp-input-icon" />
                  <input
                    className="fp-input"
                    type="email"
                    placeholder="owner@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="fp-hint">
                  We'll send a 6-digit reset code to this email
                </div>
              </div>
              <button type="submit" className="fp-submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="fp-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send Reset Code <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2 — Verify Code */}
          {step === 2 && (
            <form className="fp-form" onSubmit={handleVerifyCode}>
              <div className="fp-field">
                <label className="fp-label">Verification Code</label>
                <input
                  className="fp-input-center"
                  type="text"
                  placeholder="——————"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  maxLength="6"
                />
                <div className="fp-hint" style={{ textAlign: "center" }}>
                  Code sent to{" "}
                  <strong style={{ color: "#374151" }}>{email}</strong>
                </div>
              </div>
              <button
                type="submit"
                className="fp-submit"
                disabled={loading || code.length !== 6}
              >
                {loading ? (
                  <>
                    <div className="fp-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <KeyRound size={15} /> Verify Code <ArrowRight size={14} />
                  </>
                )}
              </button>
              <button
                type="button"
                className="fp-resend"
                onClick={() => {
                  setStep(1);
                  setCode("");
                  setError("");
                  setSuccess("");
                }}
              >
                <RefreshCw size={13} /> Resend Code
              </button>
            </form>
          )}

          {/* Step 3 — New Password */}
          {step === 3 && (
            <form className="fp-form" onSubmit={handleResetPassword}>
              <div className="fp-field">
                <label className="fp-label">New Password</label>
                <div className="fp-input-wrap">
                  <Lock size={15} className="fp-input-icon" />
                  <input
                    className="fp-input"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
              </div>
              <div className="fp-field">
                <label className="fp-label">Confirm Password</label>
                <div className="fp-input-wrap">
                  <Lock size={15} className="fp-input-icon" />
                  <input
                    className="fp-input"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                    style={{
                      borderColor:
                        confirmPassword && confirmPassword !== newPassword
                          ? "#fca5a5"
                          : undefined,
                    }}
                  />
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <div className="fp-hint" style={{ color: "#ef4444" }}>
                    Passwords do not match
                  </div>
                )}
              </div>
              <button type="submit" className="fp-submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="fp-spin" /> Resetting...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} /> Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to login */}
          <Link to="/owner-login" className="fp-back">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
