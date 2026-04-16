import React from "react";
import { getPlans, updatePlan, seedPlans } from "../../services/api";
import {
  Edit2,
  Save,
  X,
  CheckCircle,
  Database,
  Zap,
  Star,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";

const PLAN_CONFIG = {
  normal: {
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    textColor: "#1d4ed8",
    icon: Zap,
    label: "Starter",
  },
  standard: {
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    textColor: "#6d28d9",
    icon: Star,
    label: "Standard",
  },
  premium: {
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    textColor: "#b45309",
    icon: Crown,
    label: "Premium",
  },
};

const DEFAULT_CONFIG = {
  color: "#0d9488",
  bg: "#f0fdfa",
  border: "#99f6e4",
  textColor: "#0f766e",
  icon: Zap,
  label: "Plan",
};

export default function PlansPage() {
  const [plans, setPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editId, setEditId] = React.useState(null);
  const [editData, setEditData] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [seeding, setSeeding] = React.useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await getPlans();
      setPlans(res.data);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPlans();
  }, []);

  const startEdit = (plan) => {
    setEditId(plan._id);
    setEditData({
      price: plan.price,
      maxEmployees: plan.maxEmployees || "",
      maxProducts: plan.maxProducts || "",
      description: plan.description || "",
      features: (plan.features || []).join(", "),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePlan(editId, {
        price: Number(editData.price),
        maxEmployees:
          editData.maxEmployees === "" ? null : Number(editData.maxEmployees),
        maxProducts:
          editData.maxProducts === "" ? null : Number(editData.maxProducts),
        description: editData.description,
        features: editData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      });
      toast.success("Plan updated!");
      setEditId(null);
      fetchPlans();
    } catch {
      toast.error("Failed to update plan");
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm("This will reset all plans to defaults. Continue?"))
      return;
    setSeeding(true);
    try {
      await seedPlans();
      toast.success("Plans seeded with defaults!");
      fetchPlans();
    } catch {
      toast.error("Failed to seed plans");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=Outfit:wght@400;500;600;700&display=swap');
        .pp * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }

        .pp-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 26px; flex-wrap: wrap; gap: 12px; }
        .pp-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: #111827; letter-spacing: -0.3px; }
        .pp-sub { font-size: 13px; color: #9ca3af; margin-top: 3px; }

        .seed-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          border: 1px solid #e2e5ed; background: #fff;
          color: #374151; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.14s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          font-family: 'Outfit', sans-serif;
        }
        .seed-btn:hover:not(:disabled) { border-color: #0d9488; color: #0d9488; background: #f0fdfa; }
        .seed-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* LOADING */
        .pp-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 80px; }
        .spin { width: 18px; height: 18px; border: 2px solid #e2e5ed; border-top-color: #0d9488; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* EMPTY */
        .pp-empty { background: #fff; border: 1px solid #e2e5ed; border-radius: 14px; text-align: center; padding: 60px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .pp-empty-ic { width: 52px; height: 52px; background: #f4f5f9; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
        .pp-empty-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; color: #374151; }
        .pp-empty-sub { font-size: 13px; color: #9ca3af; margin-top: 5px; }

        /* PLAN GRID */
        .plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

        /* PLAN CARD */
        .plan-card {
          background: #fff;
          border: 1px solid #e2e5ed;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          transition: box-shadow 0.18s, transform 0.18s;
          display: flex; flex-direction: column;
        }
        .plan-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }

        /* CARD TOP STRIP */
        .plan-strip { height: 4px; width: 100%; }

        .plan-header { padding: 20px 20px 0; }

        .plan-type-row {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
        }

        .plan-type-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.4px;
          text-transform: uppercase;
          border: 1px solid;
        }

        .plan-price-row { margin-bottom: 4px; }
        .plan-price {
          font-family: 'Fraunces', serif;
          font-size: 32px; font-weight: 800;
          color: #111827; letter-spacing: -1px; line-height: 1;
        }
        .plan-price-mo { font-size: 13px; font-weight: 400; color: #9ca3af; letter-spacing: 0; font-family: 'Outfit', sans-serif; }

        .plan-desc { font-size: 13px; color: #6b7280; margin: 10px 0 16px; line-height: 1.5; }

        /* LIMITS STRIP */
        .plan-limits {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; padding: 14px 20px;
          border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
          background: #fafafa;
        }

        .limit-item { }
        .limit-label { font-size: 10px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: #9ca3af; }
        .limit-val { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: #111827; margin-top: 2px; line-height: 1; }
        .limit-sub { font-size: 10.5px; color: #9ca3af; margin-top: 1px; }

        /* FEATURES */
        .plan-features { padding: 14px 20px 18px; flex: 1; }
        .features-label { font-size: 10.5px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: #9ca3af; margin-bottom: 10px; }

        .feature-list { list-style: none; display: flex; flex-direction: column; gap: 7px; }
        .feature-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #374151; }
        .feature-item span { text-transform: capitalize; }

        /* CARD FOOTER */
        .plan-footer {
          padding: 14px 20px;
          border-top: 1px solid #f3f4f6;
          display: flex; justify-content: flex-end; gap: 7px;
        }

        /* EDIT MODE */
        .plan-edit-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; flex: 1; }

        .field-label { font-size: 11.5px; font-weight: 600; color: #6b7280; margin-bottom: 4px; }
        .field-input {
          width: 100%; padding: 8px 11px; border-radius: 8px;
          border: 1px solid #e2e5ed; font-size: 13px;
          color: #111827; background: #fff; outline: none;
          transition: border 0.14s; font-family: 'Outfit', sans-serif;
        }
        .field-input:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
        .field-input::placeholder { color: #d1d5db; }

        /* BUTTONS */
        .edit-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 13px; border-radius: 8px;
          border: 1px solid #e2e5ed; background: #fff;
          color: #374151; font-size: 12.5px; font-weight: 600;
          cursor: pointer; transition: all 0.14s;
          font-family: 'Outfit', sans-serif;
        }
        .edit-btn:hover { background: #f9fafb; border-color: #d1d5db; }

        .save-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 8px;
          background: #0d9488; color: #fff;
          border: none; font-size: 12.5px; font-weight: 600;
          cursor: pointer; transition: background 0.14s;
          font-family: 'Outfit', sans-serif;
          box-shadow: 0 2px 6px rgba(13,148,136,0.2);
        }
        .save-btn:hover:not(:disabled) { background: #0f766e; }
        .save-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .cancel-btn {
          display: inline-flex; align-items: center; gap: 4px;
          width: 30px; height: 30px; padding: 0;
          justify-content: center;
          border-radius: 7px; border: 1px solid #e2e5ed; background: #fff;
          color: #9ca3af; cursor: pointer; transition: all 0.14s;
        }
        .cancel-btn:hover { background: #fef2f2; border-color: #fca5a5; color: #ef4444; }

        @media (max-width: 900px) { .plan-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 580px) { .plan-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="pp">
        {/* Top */}
        <div className="pp-top">
          <div>
            <div className="pp-title">Plans & Pricing</div>
            <div className="pp-sub">
              Manage subscription plans and feature limits
            </div>
          </div>
          <button className="seed-btn" onClick={handleSeed} disabled={seeding}>
            <Database size={13} /> {seeding ? "Seeding..." : "Seed Defaults"}
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="pp-loading">
            <div className="spin" />
            <span style={{ fontSize: 13, color: "#9ca3af" }}>
              Loading plans...
            </span>
          </div>
        ) : plans.length === 0 ? (
          <div className="pp-empty">
            <div className="pp-empty-ic">
              <Database size={22} color="#9ca3af" />
            </div>
            <div className="pp-empty-title">No plans found</div>
            <div className="pp-empty-sub">
              Click "Seed Defaults" to create default plans.
            </div>
          </div>
        ) : (
          <div className="plan-grid">
            {plans.map((plan) => {
              const cfg =
                PLAN_CONFIG[plan.name?.toLowerCase()] || DEFAULT_CONFIG;
              const PlanIcon = cfg.icon;
              const isEditing = editId === plan._id;

              return (
                <div className="plan-card" key={plan._id}>
                  {/* Top color strip */}
                  <div
                    className="plan-strip"
                    style={{ background: cfg.color }}
                  />

                  {isEditing ? (
                    /* ── EDIT MODE ── */
                    <>
                      <div className="plan-header">
                        <div className="plan-type-row">
                          <div
                            className="plan-type-badge"
                            style={{
                              background: cfg.bg,
                              color: cfg.textColor,
                              borderColor: cfg.border,
                            }}
                          >
                            <PlanIcon size={11} /> {plan.name}
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              className="cancel-btn"
                              onClick={() => setEditId(null)}
                            >
                              <X size={13} />
                            </button>
                            <button
                              className="save-btn"
                              onClick={handleSave}
                              disabled={saving}
                            >
                              {saving ? (
                                <div
                                  className="spin"
                                  style={{
                                    width: 12,
                                    height: 12,
                                    borderWidth: 2,
                                    borderColor: "rgba(255,255,255,0.3)",
                                    borderTopColor: "#fff",
                                  }}
                                />
                              ) : (
                                <Save size={12} />
                              )}
                              Save
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="plan-edit-body">
                        <div>
                          <div className="field-label">Price (PKR / month)</div>
                          <input
                            type="number"
                            className="field-input"
                            value={editData.price}
                            onChange={(e) =>
                              setEditData((d) => ({
                                ...d,
                                price: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <div className="field-label">
                            Max Employees (blank = unlimited)
                          </div>
                          <input
                            type="number"
                            className="field-input"
                            placeholder="Unlimited"
                            value={editData.maxEmployees}
                            onChange={(e) =>
                              setEditData((d) => ({
                                ...d,
                                maxEmployees: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <div className="field-label">
                            Max Products (blank = unlimited)
                          </div>
                          <input
                            type="number"
                            className="field-input"
                            placeholder="Unlimited"
                            value={editData.maxProducts}
                            onChange={(e) =>
                              setEditData((d) => ({
                                ...d,
                                maxProducts: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <div className="field-label">Description</div>
                          <input
                            className="field-input"
                            value={editData.description}
                            onChange={(e) =>
                              setEditData((d) => ({
                                ...d,
                                description: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <div className="field-label">
                            Features (comma separated)
                          </div>
                          <input
                            className="field-input"
                            value={editData.features}
                            placeholder="cashier_login, reports, export"
                            onChange={(e) =>
                              setEditData((d) => ({
                                ...d,
                                features: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ── VIEW MODE ── */
                    <>
                      <div className="plan-header">
                        <div className="plan-type-row">
                          <div
                            className="plan-type-badge"
                            style={{
                              background: cfg.bg,
                              color: cfg.textColor,
                              borderColor: cfg.border,
                            }}
                          >
                            <PlanIcon size={11} />
                            {cfg.label || plan.name}
                          </div>
                        </div>

                        <div className="plan-price-row">
                          <span className="plan-price">
                            PKR {plan.price?.toLocaleString()}
                          </span>
                          <span className="plan-price-mo"> /mo</span>
                        </div>

                        {plan.description && (
                          <p className="plan-desc">{plan.description}</p>
                        )}
                      </div>

                      {/* Limits */}
                      <div className="plan-limits">
                        <div className="limit-item">
                          <div className="limit-label">Employees</div>
                          <div
                            className="limit-val"
                            style={{ color: cfg.color }}
                          >
                            {plan.maxEmployees || "∞"}
                          </div>
                          <div className="limit-sub">max users</div>
                        </div>
                        <div className="limit-item">
                          <div className="limit-label">Products</div>
                          <div
                            className="limit-val"
                            style={{ color: cfg.color }}
                          >
                            {plan.maxProducts || "∞"}
                          </div>
                          <div className="limit-sub">max items</div>
                        </div>
                      </div>

                      {/* Features */}
                      {(plan.features || []).length > 0 && (
                        <div className="plan-features">
                          <div className="features-label">Includes</div>
                          <ul className="feature-list">
                            {(plan.features || []).map((f) => (
                              <li className="feature-item" key={f}>
                                <CheckCircle
                                  size={13}
                                  style={{ color: cfg.color, flexShrink: 0 }}
                                />
                                <span>{f.replace(/_/g, " ")}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="plan-footer">
                        <button
                          className="edit-btn"
                          onClick={() => startEdit(plan)}
                        >
                          <Edit2 size={12} /> Edit Plan
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
