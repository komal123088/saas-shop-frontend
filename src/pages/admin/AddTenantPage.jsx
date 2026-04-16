import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTenant, getPlans } from "../../services/api";
import {
  ArrowLeft,
  Plus,
  Building2,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  CheckCircle,
  Zap,
  Star,
  Crown,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

const PLAN_CONFIG = {
  normal: {
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    textColor: "#1d4ed8",
    selectedBorder: "#3b82f6",
    icon: Zap,
  },
  standard: {
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    textColor: "#6d28d9",
    selectedBorder: "#8b5cf6",
    icon: Star,
  },
  premium: {
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    textColor: "#b45309",
    selectedBorder: "#f59e0b",
    icon: Crown,
  },
};
const DEFAULT_PLAN = {
  color: "#0d9488",
  bg: "#f0fdfa",
  border: "#99f6e4",
  textColor: "#0f766e",
  selectedBorder: "#0d9488",
  icon: Shield,
};

export default function AddTenantPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    planId: "",
    months: 1,
  });

  useEffect(() => {
    getPlans()
      .then((r) => {
        setPlans(r.data);
        if (r.data.length > 0)
          setForm((f) => ({ ...f, planId: r.data[0]._id }));
      })
      .catch(() => toast.error("Failed to load plans"));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.shopName ||
      !form.ownerName ||
      !form.email ||
      !form.phone ||
      !form.planId
    )
      return toast.error("Please fill all required fields");
    setLoading(true);
    try {
      await createTenant(form);
      toast.success("Tenant created successfully!");
      navigate("/admin/tenants");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Outfit:wght@400;500;600;700&display=swap');
        .at * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #6b7280;
          text-decoration: none; margin-bottom: 20px; transition: color 0.14s;
        }
        .back-link:hover { color: #0d9488; }

        .at-header { margin-bottom: 26px; }
        .at-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: #111827; letter-spacing: -0.3px; }
        .at-sub { font-size: 13px; color: #9ca3af; margin-top: 3px; }

        /* FORM LAYOUT */
        .at-form { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }

        /* CARDS */
        .at-card {
          background: #fff; border: 1px solid #e2e5ed;
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .at-card-hdr {
          padding: 14px 20px; border-bottom: 1px solid #f3f4f6;
          display: flex; align-items: center; gap: 8px;
        }
        .at-card-hdr-icon { color: #9ca3af; }
        .at-card-title { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: #111827; }
        .at-card-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

        /* FIELD */
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field-label { font-size: 12px; font-weight: 600; color: #374151; }
        .field-req { color: #ef4444; margin-left: 2px; }

        .field-input-wrap { position: relative; }
        .field-input-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
        .field-input {
          width: 100%; padding: 9px 12px 9px 34px;
          border: 1px solid #e2e5ed; border-radius: 9px;
          font-size: 13.5px; font-family: 'Outfit', sans-serif;
          color: #111827; background: #fff; outline: none;
          transition: border 0.14s, box-shadow 0.14s;
        }
        .field-input::placeholder { color: #d1d5db; }
        .field-input:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }

        /* PLAN CARDS */
        .plan-options { display: flex; flex-direction: column; gap: 10px; }

        .plan-option {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 14px; border-radius: 10px;
          border: 1.5px solid #e2e5ed; background: #fafafa;
          cursor: pointer; transition: all 0.15s;
        }
        .plan-option:hover { border-color: #d1d5db; background: #fff; }
        .plan-option.selected { background: #fff; }

        .plan-option input[type="radio"] { display: none; }

        .plan-radio {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.14s;
          background: #fff;
        }
        .plan-option.selected .plan-radio {
          border-color: var(--plan-color);
          background: var(--plan-color);
        }
        .plan-radio-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #fff;
          opacity: 0; transition: opacity 0.14s;
        }
        .plan-option.selected .plan-radio-dot { opacity: 1; }

        .plan-icon-wrap {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; border: 1px solid;
        }

        .plan-info { flex: 1; }
        .plan-name { font-size: 13.5px; font-weight: 700; color: #111827; text-transform: capitalize; }
        .plan-price { font-size: 12px; color: #6b7280; margin-top: 1px; }

        .plan-check { color: #0d9488; opacity: 0; transition: opacity 0.14s; }
        .plan-option.selected .plan-check { opacity: 1; }

        /* DURATION SELECT */
        .dur-select {
          width: 100%; padding: 9px 12px; border-radius: 9px;
          border: 1px solid #e2e5ed; font-size: 13.5px;
          color: #111827; background: #fff; outline: none;
          transition: border 0.14s; font-family: 'Outfit', sans-serif;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          padding-right: 34px;
        }
        .dur-select:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }

        /* SUMMARY CARD */
        .summary-card {
          background: #fff; border: 1px solid #e2e5ed;
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          position: sticky; top: 80px;
        }
        .summary-hdr { padding: 14px 18px; border-bottom: 1px solid #f3f4f6; }
        .summary-title { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: #111827; }
        .summary-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 11px; }

        .sum-row { display: flex; align-items: center; justify-content: space-between; }
        .sum-label { font-size: 12px; color: #9ca3af; font-weight: 500; }
        .sum-val { font-size: 13px; font-weight: 600; color: #111827; }
        .sum-val.empty { color: #d1d5db; font-weight: 400; }

        .sum-divider { height: 1px; background: #f3f4f6; }

        .sum-total-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0 0; }
        .sum-total-label { font-size: 12.5px; font-weight: 600; color: #374151; }
        .sum-total-val { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: #0d9488; }

        /* FORM ACTIONS */
        .form-actions { padding: 14px 18px; border-top: 1px solid #f3f4f6; display: flex; flex-direction: column; gap: 8px; }

        .submit-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; padding: 11px 18px; border-radius: 10px;
          background: #0d9488; color: #fff; border: none;
          font-size: 14px; font-weight: 600; font-family: 'Outfit', sans-serif;
          cursor: pointer; transition: background 0.14s;
          box-shadow: 0 2px 8px rgba(13,148,136,0.25);
        }
        .submit-btn:hover:not(:disabled) { background: #0f766e; }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .cancel-link {
          display: flex; align-items: center; justify-content: center;
          padding: 9px; border-radius: 10px;
          border: 1px solid #e2e5ed; background: #fff;
          color: #6b7280; font-size: 13px; font-weight: 600;
          text-decoration: none; transition: all 0.14s;
        }
        .cancel-link:hover { background: #f9fafb; color: #374151; }

        .spin { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .at-form { grid-template-columns: 1fr; }
          .summary-card { position: static; }
          .field-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="at">
        <Link to="/admin/tenants" className="back-link">
          <ArrowLeft size={14} /> Back to Tenants
        </Link>

        <div className="at-header">
          <div className="at-title">Add New Tenant</div>
          <div className="at-sub">
            Manually onboard a customer to the platform
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="at-form">
            {/* LEFT — Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Shop Info */}
              <div className="at-card">
                <div className="at-card-hdr">
                  <Building2 size={15} className="at-card-hdr-icon" />
                  <div className="at-card-title">Shop Information</div>
                </div>
                <div className="at-card-body">
                  <div className="field-row">
                    <div className="field">
                      <label className="field-label">
                        Shop Name <span className="field-req">*</span>
                      </label>
                      <div className="field-input-wrap">
                        <Building2 size={14} className="field-input-icon" />
                        <input
                          className="field-input"
                          placeholder="Ahmed General Store"
                          value={form.shopName}
                          onChange={(e) => set("shopName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="field-label">
                        Owner Name <span className="field-req">*</span>
                      </label>
                      <div className="field-input-wrap">
                        <User size={14} className="field-input-icon" />
                        <input
                          className="field-input"
                          placeholder="Ahmed Khan"
                          value={form.ownerName}
                          onChange={(e) => set("ownerName", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label className="field-label">
                        Email Address <span className="field-req">*</span>
                      </label>
                      <div className="field-input-wrap">
                        <Mail size={14} className="field-input-icon" />
                        <input
                          className="field-input"
                          type="email"
                          placeholder="ahmed@shop.com"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="field-label">
                        Phone Number <span className="field-req">*</span>
                      </label>
                      <div className="field-input-wrap">
                        <Phone size={14} className="field-input-icon" />
                        <input
                          className="field-input"
                          placeholder="03001234567"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="at-card">
                <div className="at-card-hdr">
                  <CreditCard size={15} className="at-card-hdr-icon" />
                  <div className="at-card-title">Plan Selection</div>
                </div>
                <div className="at-card-body">
                  <div className="plan-options">
                    {plans.map((plan) => {
                      const cfg =
                        PLAN_CONFIG[plan.name?.toLowerCase()] || DEFAULT_PLAN;
                      const PlanIcon = cfg.icon;
                      const selected = form.planId === plan._id;
                      return (
                        <div
                          key={plan._id}
                          className={`plan-option ${selected ? "selected" : ""}`}
                          style={{
                            "--plan-color": cfg.color,
                            borderColor: selected ? cfg.color : undefined,
                            background: selected ? cfg.bg : undefined,
                          }}
                          onClick={() => set("planId", plan._id)}
                        >
                          <input
                            type="radio"
                            name="plan"
                            value={plan._id}
                            checked={selected}
                            onChange={() => set("planId", plan._id)}
                          />
                          <div className="plan-radio">
                            <div className="plan-radio-dot" />
                          </div>
                          <div
                            className="plan-icon-wrap"
                            style={{
                              background: cfg.bg,
                              borderColor: cfg.border,
                              color: cfg.color,
                            }}
                          >
                            <PlanIcon size={15} />
                          </div>
                          <div className="plan-info">
                            <div className="plan-name">{plan.name}</div>
                            <div className="plan-price">
                              PKR {plan.price?.toLocaleString()} / month
                            </div>
                          </div>
                          <CheckCircle size={16} className="plan-check" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="field">
                    <label className="field-label">
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Calendar size={13} style={{ color: "#9ca3af" }} />{" "}
                        Subscription Duration
                      </span>
                    </label>
                    <select
                      className="dur-select"
                      value={form.months}
                      onChange={(e) => set("months", e.target.value)}
                    >
                      {[1, 2, 3, 6, 12].map((m) => (
                        <option key={m} value={m}>
                          {m} Month{m > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Summary + Actions */}
            <div className="summary-card">
              <div className="summary-hdr">
                <div className="summary-title">Summary</div>
              </div>
              <div className="summary-body">
                {(() => {
                  const selectedPlan = plans.find((p) => p._id === form.planId);
                  const cfg = selectedPlan
                    ? PLAN_CONFIG[selectedPlan.name?.toLowerCase()] ||
                      DEFAULT_PLAN
                    : null;
                  const total = selectedPlan
                    ? selectedPlan.price * Number(form.months)
                    : 0;

                  return (
                    <>
                      <div className="sum-row">
                        <span className="sum-label">Shop</span>
                        <span
                          className={`sum-val ${!form.shopName ? "empty" : ""}`}
                        >
                          {form.shopName || "—"}
                        </span>
                      </div>
                      <div className="sum-row">
                        <span className="sum-label">Owner</span>
                        <span
                          className={`sum-val ${!form.ownerName ? "empty" : ""}`}
                        >
                          {form.ownerName || "—"}
                        </span>
                      </div>
                      <div className="sum-row">
                        <span className="sum-label">Email</span>
                        <span
                          className={`sum-val ${!form.email ? "empty" : ""}`}
                          style={{ fontSize: 12, wordBreak: "break-all" }}
                        >
                          {form.email || "—"}
                        </span>
                      </div>
                      <div className="sum-divider" />
                      <div className="sum-row">
                        <span className="sum-label">Plan</span>
                        {selectedPlan ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              fontSize: 12.5,
                              fontWeight: 600,
                              color: cfg.textColor,
                              background: cfg.bg,
                              border: `1px solid ${cfg.border}`,
                              padding: "2px 9px",
                              borderRadius: 20,
                            }}
                          >
                            {selectedPlan.name}
                          </span>
                        ) : (
                          <span className="sum-val empty">—</span>
                        )}
                      </div>
                      <div className="sum-row">
                        <span className="sum-label">Duration</span>
                        <span className="sum-val">
                          {form.months} month{form.months > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="sum-row">
                        <span className="sum-label">Monthly</span>
                        <span className="sum-val">
                          PKR {selectedPlan?.price?.toLocaleString() || "—"}
                        </span>
                      </div>
                      <div className="sum-divider" />
                      <div className="sum-total-row">
                        <span className="sum-total-label">Total</span>
                        <span className="sum-total-val">
                          PKR {total ? total.toLocaleString() : "—"}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spin" /> Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={15} /> Create Tenant
                    </>
                  )}
                </button>
                <Link to="/admin/tenants" className="cancel-link">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
