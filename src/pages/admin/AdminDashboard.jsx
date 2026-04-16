import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnalytics, getTenants } from "../../services/api";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  Plus,
  Eye,
  TrendingUp,
  AlertCircle,
  Store,
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTenants, setRecentTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, tRes] = await Promise.all([
          getAnalytics(),
          getTenants({ limit: 5 }),
        ]);
        setStats(aRes.data);
        setRecentTenants(tRes.data.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            border: "2px solid #e2e5ed",
            borderTopColor: "#0d9488",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <span
          style={{
            fontSize: 14,
            color: "#9ca3af",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Loading dashboard...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );

  const statCards = [
    {
      label: "Total Tenants",
      value: stats?.total || 0,
      icon: Users,
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
      change: "+12% this month",
      trend: true,
    },
    {
      label: "Active",
      value: stats?.active || 0,
      icon: CheckCircle,
      color: "#10b981",
      bg: "#f0fdf4",
      border: "#a7f3d0",
      change: "Running smoothly",
      trend: true,
    },
    {
      label: "Suspended",
      value: stats?.suspended || 0,
      icon: AlertCircle,
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
      change: "Needs attention",
      trend: false,
    },
    {
      label: "Expired",
      value: stats?.expired || 0,
      icon: Clock,
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fecaca",
      change: "Plan expired",
      trend: false,
    },
  ];

  const statusConfig = {
    active: {
      label: "Active",
      bg: "#f0fdf4",
      color: "#15803d",
      border: "#bbf7d0",
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

  const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || {
      label: status,
      bg: "#f3f4f6",
      color: "#374151",
      border: "#d1d5db",
    };
    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 9px",
          borderRadius: 20,
          fontSize: 11.5,
          fontWeight: 600,
          background: cfg.bg,
          color: cfg.color,
          border: `1px solid ${cfg.border}`,
        }}
      >
        {cfg.label}
      </span>
    );
  };

  const PlanBadge = ({ plan }) => {
    if (!plan) return <span style={{ color: "#d1d5db", fontSize: 13 }}>—</span>;
    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 9px",
          borderRadius: 20,
          fontSize: 11.5,
          fontWeight: 600,
          background: "#f0fdfa",
          color: "#0f766e",
          border: "1px solid #99f6e4",
        }}
      >
        {plan.name}
      </span>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        .dash-wrap * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }

        .dash-top {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
        }
        .dash-headline { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.4px; }
        .dash-date { font-size: 12.5px; color: #9ca3af; margin-top: 3px; }

        .add-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 16px; border-radius: 9px;
          background: #0d9488; color: #fff;
          font-size: 13px; font-weight: 600; text-decoration: none;
          transition: background 0.14s;
          box-shadow: 0 2px 8px rgba(13,148,136,0.25);
        }
        .add-btn:hover { background: #0f766e; color: #fff; }

        /* STAT CARDS */
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }

        .stat-card {
          background: #fff;
          border: 1px solid #e2e5ed;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: box-shadow 0.15s, transform 0.15s;
        }
        .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }

        .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .stat-icon-wrap { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid; }
        .stat-val { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 700; color: #111827; letter-spacing: -0.5px; line-height: 1; }
        .stat-label { font-size: 13px; color: #6b7280; margin-top: 4px; font-weight: 500; }
        .stat-change { display: flex; align-items: center; gap: 4px; font-size: 11.5px; color: #9ca3af; margin-top: 8px; }
        .stat-trend-up { color: #10b981; }

        /* TABLE CARD */
        .table-card { background: #fff; border: 1px solid #e2e5ed; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .table-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #f3f4f6; }
        .table-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; color: #111827; }
        .view-all { display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px; font-weight: 600; color: #0d9488; text-decoration: none; }
        .view-all:hover { color: #0f766e; }

        table { width: 100%; border-collapse: collapse; }
        thead th { font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: #9ca3af; padding: 10px 16px; text-align: left; background: #fafafa; border-bottom: 1px solid #f3f4f6; }
        tbody tr { border-bottom: 1px solid #f9fafb; transition: background 0.1s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #fafafa; }
        tbody td { padding: 13px 16px; font-size: 13.5px; color: #374151; vertical-align: middle; }

        .shop-name { font-weight: 600; color: #111827; font-size: 13.5px; }
        .shop-email { font-size: 12px; color: #9ca3af; margin-top: 1px; }

        .view-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 7px;
          background: #f4f5f9; color: #374151;
          font-size: 12px; font-weight: 600; text-decoration: none;
          transition: all 0.14s;
          border: 1px solid #e2e5ed;
        }
        .view-btn:hover { background: #f0fdfa; color: #0d9488; border-color: #99f6e4; }

        /* EMPTY */
        .empty-state { text-align: center; padding: 52px 24px; }
        .empty-icon { width: 52px; height: 52px; background: #f4f5f9; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
        .empty-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; color: #374151; }
        .empty-sub { font-size: 13px; color: #9ca3af; margin-top: 5px; }

        @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .stat-grid { grid-template-columns: 1fr 1fr; } .dash-headline { font-size: 18px; } }
      `}</style>

      <div className="dash-wrap">
        {/* Top bar */}
        <div className="dash-top">
          <div>
            <div className="dash-headline">Platform Overview</div>
            <div className="dash-date">
              {format(new Date(), "EEEE, MMMM d yyyy")} — Real-time data
            </div>
          </div>
          <Link to="/admin/tenants/add" className="add-btn">
            <Plus size={14} /> Add Tenant
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div className="stat-card" key={s.label}>
                <div className="stat-top">
                  <div
                    className="stat-icon-wrap"
                    style={{
                      background: s.bg,
                      borderColor: s.border,
                      color: s.color,
                    }}
                  >
                    <Icon size={17} />
                  </div>
                  {s.trend && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#10b981",
                        background: "#f0fdf4",
                        padding: "2px 7px",
                        borderRadius: 20,
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      ↑ Live
                    </span>
                  )}
                </div>
                <div className="stat-val">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-change">
                  <TrendingUp
                    size={11}
                    className={s.trend ? "stat-trend-up" : ""}
                    style={{ color: s.trend ? "#10b981" : "#d1d5db" }}
                  />
                  {s.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Tenants Table */}
        <div className="table-card">
          <div className="table-head">
            <div className="table-title">Recent Tenants</div>
            <Link to="/admin/tenants" className="view-all">
              View All <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentTenants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Store size={22} color="#9ca3af" />
              </div>
              <div className="empty-title">No tenants yet</div>
              <div className="empty-sub">
                Add your first customer to get started
              </div>
              <Link
                to="/admin/tenants/add"
                className="add-btn"
                style={{ marginTop: 16, display: "inline-flex" }}
              >
                <Plus size={13} /> Add Tenant
              </Link>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Shop</th>
                  <th>Owner</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTenants.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div className="shop-name">{t.shopName}</div>
                      <div className="shop-email">{t.email}</div>
                    </td>
                    <td>{t.ownerName}</td>
                    <td>
                      <PlanBadge plan={t.plan} />
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>
                      {t.planExpiry
                        ? format(new Date(t.planExpiry), "MMM d, yyyy")
                        : "—"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link to={`/admin/tenants/${t._id}`} className="view-btn">
                        <Eye size={12} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
