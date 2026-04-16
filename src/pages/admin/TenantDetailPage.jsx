import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getTenant,
  updateTenantStatus,
  extendTenantPlan,
  deleteTenant,
} from "../../services/api";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Ban,
  Clock,
  Trash2,
  CreditCard,
  X,
  AlertTriangle,
  Zap,
  Star,
  Crown,
  Shield,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  active: {
    label: "Active",
    bg: "#f0fdf4",
    color: "#15803d",
    border: "#a7f3d0",
  },
  suspended: {
    label: "Suspended",
    bg: "#fffbeb",
    color: "#b45309",
    border: "#fde68a",
  },
  expired: {
    label: "Expired",
    bg: "#fef2f2",
    color: "#b91c1c",
    border: "#fecaca",
  },
  pending: {
    label: "Pending",
    bg: "#f5f3ff",
    color: "#6d28d9",
    border: "#ddd6fe",
  },
};

const PLAN_CONFIG = {
  normal: {
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    textColor: "#1d4ed8",
    icon: Zap,
  },
  standard: {
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    textColor: "#6d28d9",
    icon: Star,
  },
  premium: {
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    textColor: "#b45309",
    icon: Crown,
  },
};

const DEFAULT_PLAN = {
  color: "#0d9488",
  bg: "#f0fdfa",
  border: "#99f6e4",
  textColor: "#0f766e",
  icon: Shield,
};

export default function TenantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extendModal, setExtendModal] = useState(false);
  const [months, setMonths] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTenant = async () => {
    setLoading(true);
    try {
      const res = await getTenant(id);
      setTenant(res.data);
    } catch {
      toast.error("Tenant not found");
      navigate("/admin/tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, [id]);

  const handleStatus = async (status) => {
    setActionLoading(true);
    try {
      await updateTenantStatus(id, status);
      toast.success(`Tenant ${status}`);
      fetchTenant();
    } catch {
      toast.error("Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtend = async () => {
    setActionLoading(true);
    try {
      await extendTenantPlan(id, Number(months));
      toast.success(`Plan extended by ${months} month(s)`);
      setExtendModal(false);
      fetchTenant();
    } catch {
      toast.error("Failed to extend");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete "${tenant.shopName}"?`)) return;
    try {
      await deleteTenant(id);
      toast.success("Tenant deleted");
      navigate("/admin/tenants");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Outfit:wght@400;500;600;700&display=swap');
        .td * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }

        /* LOADING */
        .td-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 80px; }
        .spin { width: 18px; height: 18px; border: 2px solid #e2e5ed; border-top-color: #0d9488; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* BACK */
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #6b7280;
          text-decoration: none; margin-bottom: 20px;
          transition: color 0.14s;
        }
        .back-link:hover { color: #0d9488; }

        /* PAGE HEADER */
        .pg-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 24px; flex-wrap: wrap; gap: 14px;
        }
        .pg-header-l { display: flex; align-items: center; gap: 14px; }

        .shop-avatar {
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, #0d9488, #14b8a6);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Fraunces', serif; font-weight: 800;
          font-size: 22px; color: #fff;
          box-shadow: 0 4px 14px rgba(13,148,136,0.25);
          flex-shrink: 0;
        }

        .shop-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.4px; }
        .shop-sub { font-size: 13px; color: #9ca3af; margin-top: 3px; }

        /* ACTION BUTTONS */
        .action-row { display: flex; gap: 8px; flex-wrap: wrap; }

        .btn-extend {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          background: #fff; border: 1px solid #e2e5ed;
          color: #374151; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.14s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          font-family: 'Outfit', sans-serif;
        }
        .btn-extend:hover { border-color: #0d9488; color: #0d9488; background: #f0fdfa; }

        .btn-activate {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          background: #f0fdf4; border: 1px solid #a7f3d0;
          color: #15803d; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.14s;
          font-family: 'Outfit', sans-serif;
        }
        .btn-activate:hover { background: #dcfce7; }
        .btn-activate:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-suspend {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          background: #fffbeb; border: 1px solid #fde68a;
          color: #b45309; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.14s;
          font-family: 'Outfit', sans-serif;
        }
        .btn-suspend:hover { background: #fef3c7; }
        .btn-suspend:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-delete {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #b91c1c; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.14s;
          font-family: 'Outfit', sans-serif;
        }
        .btn-delete:hover { background: #fee2e2; }

        /* GRID LAYOUT */
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

        /* CARDS */
        .det-card {
          background: #fff; border: 1px solid #e2e5ed;
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .det-card-header {
          padding: 14px 18px; border-bottom: 1px solid #f3f4f6;
          display: flex; align-items: center; gap: 8px;
        }
        .det-card-title { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: #111827; }
        .det-card-icon { color: #9ca3af; flex-shrink: 0; }

        .det-card-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 13px; }

        /* INFO ROW */
        .info-row { display: flex; align-items: flex-start; gap: 10px; }
        .info-row-icon { color: #9ca3af; flex-shrink: 0; margin-top: 2px; }
        .info-row-label { font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9ca3af; }
        .info-row-val { font-size: 13.5px; font-weight: 600; color: #111827; margin-top: 2px; }

        /* STATUS BADGE */
        .status-badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 20px; font-size: 12px; font-weight: 600;
          border: 1px solid;
        }

        /* PLAN BADGE */
        .plan-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 12px; font-weight: 600; border: 1px solid;
          text-transform: capitalize;
        }

        /* EXPIRY STRIP */
        .expiry-strip {
          padding: 10px 14px; border-radius: 10px;
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600;
          border: 1px solid;
        }

        /* DAYS LEFT BAR */
        .days-bar-wrap { margin-top: 4px; }
        .days-bar-track { height: 6px; background: #f3f4f6; border-radius: 99px; overflow: hidden; }
        .days-bar-fill { height: 100%; border-radius: 99px; transition: width 0.4s; }
        .days-bar-label { font-size: 11px; color: #9ca3af; margin-top: 4px; }

        /* FEATURES LIST */
        .feat-list { list-style: none; display: flex; flex-direction: column; gap: 7px; }
        .feat-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #374151; text-transform: capitalize; }

        /* STATS ROW */
        .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .stat-mini {
          padding: 12px 14px; border-radius: 10px;
          background: #fafafa; border: 1px solid #f3f4f6;
        }
        .stat-mini-label { font-size: 10px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: #9ca3af; }
        .stat-mini-val { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: #111827; margin-top: 3px; }

        /* MODAL */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(17,24,39,0.35); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: fadein 0.15s ease;
        }
        @keyframes fadein { from { opacity:0; } to { opacity:1; } }

        .modal-box {
          background: #fff; border-radius: 16px; width: 100%; max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          animation: slideup 0.18s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slideup { from { transform: translateY(14px); opacity:0; } to { transform: translateY(0); opacity:1; } }

        .modal-hdr { padding: 18px 20px 14px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
        .modal-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; color: #111827; }
        .modal-close { width: 27px; height: 27px; border: 1px solid #e2e5ed; background: #fff; color: #9ca3af; border-radius: 7px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; }
        .modal-close:hover { background: #fef2f2; border-color: #fca5a5; color: #ef4444; }

        .modal-body { padding: 18px 20px; }
        .modal-info { padding: 10px 12px; background: #fafafa; border: 1px solid #f3f4f6; border-radius: 9px; margin-bottom: 16px; font-size: 13px; color: #6b7280; }
        .modal-info span { font-weight: 600; color: #111827; }

        .field-label { font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 5px; }
        .months-input-row { display: flex; align-items: center; gap: 10px; }
        .months-btn { width: 34px; height: 34px; border: 1px solid #e2e5ed; background: #fff; border-radius: 8px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #374151; transition: all 0.13s; font-family: 'Outfit', sans-serif; }
        .months-btn:hover { border-color: #0d9488; color: #0d9488; background: #f0fdfa; }
        .months-val { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: #111827; min-width: 36px; text-align: center; }
        .months-label { font-size: 12px; color: #9ca3af; }

        .modal-footer { padding: 12px 20px; border-top: 1px solid #f3f4f6; display: flex; gap: 8px; justify-content: flex-end; }
        .btn-cancel-modal { padding: 8px 16px; border-radius: 9px; border: 1px solid #e2e5ed; background: #fff; color: #374151; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.14s; font-family: 'Outfit', sans-serif; }
        .btn-cancel-modal:hover { background: #f9fafb; }
        .btn-confirm { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 9px; background: #0d9488; color: #fff; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.14s; font-family: 'Outfit', sans-serif; box-shadow: 0 2px 6px rgba(13,148,136,0.22); }
        .btn-confirm:hover:not(:disabled) { background: #0f766e; }
        .btn-confirm:disabled { opacity: 0.65; cursor: not-allowed; }

        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } .pg-header { flex-direction: column; } }
      `}</style>

      <div className="td">
        {loading ? (
          <div className="td-loading">
            <div className="spin" />
            <span style={{ fontSize: 13, color: "#9ca3af" }}>
              Loading tenant...
            </span>
          </div>
        ) : !tenant ? null : (
          (() => {
            const statusCfg =
              STATUS_CONFIG[tenant.status] || STATUS_CONFIG.pending;
            const planCfg =
              PLAN_CONFIG[tenant.plan?.name?.toLowerCase()] || DEFAULT_PLAN;
            const PlanIcon = planCfg.icon;

            const isExpired =
              tenant.planExpiry && new Date(tenant.planExpiry) < new Date();
            const daysLeft = tenant.planExpiry
              ? Math.ceil(
                  (new Date(tenant.planExpiry) - new Date()) /
                    (1000 * 60 * 60 * 24),
                )
              : 0;

            const totalDays =
              tenant.planStartDate && tenant.planExpiry
                ? Math.ceil(
                    (new Date(tenant.planExpiry) -
                      new Date(tenant.planStartDate)) /
                      (1000 * 60 * 60 * 24),
                  )
                : 30;
            const progressPct = Math.max(
              0,
              Math.min(100, (daysLeft / totalDays) * 100),
            );

            const expiryColor = isExpired
              ? "#ef4444"
              : daysLeft <= 7
                ? "#f59e0b"
                : "#10b981";
            const expiryBg = isExpired
              ? "#fef2f2"
              : daysLeft <= 7
                ? "#fffbeb"
                : "#f0fdf4";
            const expiryBorder = isExpired
              ? "#fecaca"
              : daysLeft <= 7
                ? "#fde68a"
                : "#a7f3d0";

            return (
              <>
                {/* Back */}
                <Link to="/admin/tenants" className="back-link">
                  <ArrowLeft size={14} /> Back to Tenants
                </Link>

                {/* Page Header */}
                <div className="pg-header">
                  <div className="pg-header-l">
                    <div className="shop-avatar">
                      {tenant.shopName?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                    <div>
                      <div className="shop-title">{tenant.shopName}</div>
                      <div className="shop-sub">{tenant.email}</div>
                    </div>
                  </div>

                  <div className="action-row">
                    <button
                      className="btn-extend"
                      onClick={() => setExtendModal(true)}
                    >
                      <Clock size={13} /> Extend Plan
                    </button>
                    {tenant.status !== "active" ? (
                      <button
                        className="btn-activate"
                        onClick={() => handleStatus("active")}
                        disabled={actionLoading}
                      >
                        <CheckCircle size={13} /> Activate
                      </button>
                    ) : (
                      <button
                        className="btn-suspend"
                        onClick={() => handleStatus("suspended")}
                        disabled={actionLoading}
                      >
                        <Ban size={13} /> Suspend
                      </button>
                    )}
                    <button className="btn-delete" onClick={handleDelete}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>

                {/* Detail Grid */}
                <div className="detail-grid">
                  {/* Tenant Info Card */}
                  <div className="det-card">
                    <div className="det-card-header">
                      <Building2 size={15} className="det-card-icon" />
                      <div className="det-card-title">Tenant Information</div>
                    </div>
                    <div className="det-card-body">
                      <div className="info-row">
                        <Building2 size={14} className="info-row-icon" />
                        <div>
                          <div className="info-row-label">Shop Name</div>
                          <div className="info-row-val">{tenant.shopName}</div>
                        </div>
                      </div>
                      <div className="info-row">
                        <Mail size={14} className="info-row-icon" />
                        <div>
                          <div className="info-row-label">Owner</div>
                          <div className="info-row-val">{tenant.ownerName}</div>
                        </div>
                      </div>
                      <div className="info-row">
                        <Mail size={14} className="info-row-icon" />
                        <div>
                          <div className="info-row-label">Email</div>
                          <div className="info-row-val">{tenant.email}</div>
                        </div>
                      </div>
                      <div className="info-row">
                        <Phone size={14} className="info-row-icon" />
                        <div>
                          <div className="info-row-label">Phone</div>
                          <div className="info-row-val">
                            {tenant.phone || "—"}
                          </div>
                        </div>
                      </div>
                      <div className="info-row">
                        <Calendar size={14} className="info-row-icon" />
                        <div>
                          <div className="info-row-label">Joined</div>
                          <div className="info-row-val">
                            {format(new Date(tenant.createdAt), "PPP")}
                          </div>
                        </div>
                      </div>
                      <div className="info-row">
                        <Shield size={14} className="info-row-icon" />
                        <div>
                          <div className="info-row-label">Status</div>
                          <div style={{ marginTop: 4 }}>
                            <span
                              className="status-badge"
                              style={{
                                background: statusCfg.bg,
                                color: statusCfg.color,
                                borderColor: statusCfg.border,
                              }}
                            >
                              {statusCfg.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Card */}
                  <div className="det-card">
                    <div className="det-card-header">
                      <CreditCard size={15} className="det-card-icon" />
                      <div className="det-card-title">Subscription Details</div>
                    </div>
                    <div className="det-card-body">
                      {/* Plan + Price */}
                      <div className="stats-row">
                        <div className="stat-mini">
                          <div className="stat-mini-label">Current Plan</div>
                          <div style={{ marginTop: 6 }}>
                            <span
                              className="plan-badge"
                              style={{
                                background: planCfg.bg,
                                color: planCfg.textColor,
                                borderColor: planCfg.border,
                              }}
                            >
                              <PlanIcon size={11} />
                              {tenant.plan?.name || "No Plan"}
                            </span>
                          </div>
                        </div>
                        <div className="stat-mini">
                          <div className="stat-mini-label">Monthly Price</div>
                          <div className="stat-mini-val">
                            PKR {tenant.plan?.price?.toLocaleString() || "0"}
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      {tenant.planStartDate && (
                        <div className="info-row">
                          <Calendar size={14} className="info-row-icon" />
                          <div>
                            <div className="info-row-label">Start Date</div>
                            <div className="info-row-val">
                              {format(new Date(tenant.planStartDate), "PPP")}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Expiry + Days */}
                      {tenant.planExpiry && (
                        <div>
                          <div className="info-row" style={{ marginBottom: 8 }}>
                            <Clock size={14} className="info-row-icon" />
                            <div>
                              <div className="info-row-label">Expiry Date</div>
                              <div className="info-row-val">
                                {format(new Date(tenant.planExpiry), "PPP")}
                              </div>
                            </div>
                          </div>
                          <div
                            className="expiry-strip"
                            style={{
                              background: expiryBg,
                              borderColor: expiryBorder,
                              color: expiryColor,
                            }}
                          >
                            {isExpired ? (
                              <AlertTriangle size={14} />
                            ) : (
                              <Clock size={14} />
                            )}
                            {isExpired
                              ? "Plan has expired"
                              : `${daysLeft} days remaining`}
                          </div>
                          {!isExpired && (
                            <div className="days-bar-wrap">
                              <div className="days-bar-track">
                                <div
                                  className="days-bar-fill"
                                  style={{
                                    width: `${progressPct}%`,
                                    background: expiryColor,
                                  }}
                                />
                              </div>
                              <div className="days-bar-label">
                                {Math.round(progressPct)}% of subscription
                                remaining
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Limits */}
                      <div className="stats-row">
                        <div className="stat-mini">
                          <div className="stat-mini-label">Max Employees</div>
                          <div
                            className="stat-mini-val"
                            style={{ color: planCfg.color }}
                          >
                            {tenant.plan?.maxEmployees || "∞"}
                          </div>
                        </div>
                        <div className="stat-mini">
                          <div className="stat-mini-label">Max Products</div>
                          <div
                            className="stat-mini-val"
                            style={{ color: planCfg.color }}
                          >
                            {tenant.plan?.maxProducts || "∞"}
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      {(tenant.plan?.features || []).length > 0 && (
                        <div>
                          <div
                            style={{
                              fontSize: 10.5,
                              fontWeight: 600,
                              letterSpacing: "0.6px",
                              textTransform: "uppercase",
                              color: "#9ca3af",
                              marginBottom: 8,
                            }}
                          >
                            Plan Features
                          </div>
                          <ul className="feat-list">
                            {tenant.plan.features.map((f) => (
                              <li className="feat-item" key={f}>
                                <CheckCircle
                                  size={13}
                                  style={{
                                    color: planCfg.color,
                                    flexShrink: 0,
                                  }}
                                />
                                {f.replace(/_/g, " ")}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Extend Modal */}
                {extendModal && (
                  <div
                    className="modal-overlay"
                    onClick={(e) =>
                      e.target === e.currentTarget && setExtendModal(false)
                    }
                  >
                    <div className="modal-box">
                      <div className="modal-hdr">
                        <div className="modal-title">Extend Plan</div>
                        <button
                          className="modal-close"
                          onClick={() => setExtendModal(false)}
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="modal-info">
                          Current expiry:{" "}
                          <span>
                            {tenant.planExpiry
                              ? format(new Date(tenant.planExpiry), "PPP")
                              : "Not set"}
                          </span>
                        </div>
                        <div className="field-label">Months to Add</div>
                        <div className="months-input-row">
                          <button
                            className="months-btn"
                            onClick={() => setMonths((m) => Math.max(1, m - 1))}
                          >
                            −
                          </button>
                          <div>
                            <div className="months-val">{months}</div>
                            <div className="months-label">
                              month{months > 1 ? "s" : ""}
                            </div>
                          </div>
                          <button
                            className="months-btn"
                            onClick={() =>
                              setMonths((m) => Math.min(24, m + 1))
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          className="btn-cancel-modal"
                          onClick={() => setExtendModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-confirm"
                          onClick={handleExtend}
                          disabled={actionLoading}
                        >
                          {actionLoading ? (
                            <>
                              <div
                                className="spin"
                                style={{
                                  width: 13,
                                  height: 13,
                                  borderWidth: 2,
                                  borderColor: "rgba(255,255,255,0.3)",
                                  borderTopColor: "#fff",
                                }}
                              />{" "}
                              Extending...
                            </>
                          ) : (
                            <>
                              <Clock size={13} /> Extend {months} Month
                              {months > 1 ? "s" : ""}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()
        )}
      </div>
    </>
  );
}
