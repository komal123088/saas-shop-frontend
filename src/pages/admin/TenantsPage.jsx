import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getTenants,
  updateTenantStatus,
  deleteTenant,
} from "../../services/api";
import {
  Plus,
  Search,
  Eye,
  MoreVertical,
  Ban,
  CheckCircle,
  Trash2,
  RefreshCw,
  Users,
  Store,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const STATUS_FILTERS = ["all", "active", "suspended", "expired", "pending"];

const statusCfg = {
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

const StatusBadge = ({ status }) => {
  const c = statusCfg[status] || {
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
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
      }}
    >
      {c.label}
    </span>
  );
};

const PlanBadge = ({ plan }) => {
  if (!plan) return <span style={{ color: "#d1d5db" }}>—</span>;
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

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await getTenants(params);
      setTenants(res.data);
    } catch {
      toast.error("Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [statusFilter]);
  useEffect(() => {
    const d = setTimeout(fetchTenants, 400);
    return () => clearTimeout(d);
  }, [search]);

  useEffect(() => {
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateTenantStatus(id, status);
      toast.success(`Tenant ${status} successfully`);
      fetchTenants();
    } catch {
      toast.error("Failed to update status");
    }
    setOpenMenu(null);
  };

  const handleDelete = async (id, shopName) => {
    if (!window.confirm(`Delete "${shopName}"?`)) return;
    try {
      await deleteTenant(id);
      toast.success("Tenant deleted");
      fetchTenants();
    } catch {
      toast.error("Failed to delete tenant");
    }
    setOpenMenu(null);
  };

  const filterLabel = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const filteredCount = tenants.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Outfit:wght@400;500;600;700&display=swap');
        .tp * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }

        .tp-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; flex-wrap: wrap; gap: 12px; }
        .tp-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: #111827; letter-spacing: -0.3px; }
        .tp-sub { font-size: 13px; color: #9ca3af; margin-top: 3px; }
        .tp-actions { display: flex; gap: 8px; align-items: center; }

        .icon-btn {
          width: 36px; height: 36px; border: 1px solid #e2e5ed; background: #fff;
          color: #6b7280; border-radius: 9px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.14s; box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .icon-btn:hover { border-color: #0d9488; color: #0d9488; background: #f0fdfa; }

        .add-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 16px; border-radius: 9px;
          background: #0d9488; color: #fff; text-decoration: none;
          font-size: 13px; font-weight: 600;
          transition: background 0.14s;
          box-shadow: 0 2px 8px rgba(13,148,136,0.25);
        }
        .add-btn:hover { background: #0f766e; color: #fff; }

        /* TOOLBAR */
        .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }

        .search-wrap {
          position: relative; flex: 1; min-width: 200px;
        }
        .search-wrap svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
        .search-input {
          width: 100%; padding: 9px 12px 9px 34px;
          border: 1px solid #e2e5ed; border-radius: 9px;
          font-size: 13.5px; font-family: 'Outfit', sans-serif;
          color: #111827; background: #fff; outline: none;
          transition: border 0.14s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .search-input::placeholder { color: #9ca3af; }
        .search-input:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }

        .filter-tabs { display: flex; gap: 4px; background: #fff; border: 1px solid #e2e5ed; border-radius: 10px; padding: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .filter-tab {
          padding: 6px 12px; border-radius: 7px; border: none; background: transparent;
          font-size: 12.5px; font-weight: 500; color: #6b7280;
          cursor: pointer; transition: all 0.14s; font-family: 'Outfit', sans-serif;
          white-space: nowrap;
        }
        .filter-tab:hover { background: #f4f5f9; color: #111827; }
        .filter-tab.active { background: #0d9488; color: #fff; font-weight: 600; box-shadow: 0 2px 6px rgba(13,148,136,0.2); }

        /* TABLE CARD */
        .table-card { background: #fff; border: 1px solid #e2e5ed; border-radius: 14px; overflow: visible; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .tc-hdr { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #f3f4f6; border-radius: 14px 14px 0 0; }
        .tc-label { font-family: 'Fraunces', serif; font-size: 14.5px; font-weight: 600; color: #111827; }
        .tc-count { font-size: 12px; font-weight: 600; color: #0f766e; background: #f0fdfa; border: 1px solid #99f6e4; padding: 2px 9px; border-radius: 20px; }
        .table-wrap { border-radius: 0 0 14px 14px; overflow: hidden; }

        table { width: 100%; border-collapse: collapse; }
        thead th { font-size: 10.5px; font-weight: 600; letter-spacing: 0.7px; text-transform: uppercase; color: #9ca3af; padding: 10px 16px; text-align: left; background: #fafafa; border-bottom: 1px solid #f3f4f6; }
        tbody tr { border-bottom: 1px solid #f9fafb; transition: background 0.1s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #fafafa; }
        tbody td { padding: 13px 16px; font-size: 13.5px; color: #374151; vertical-align: middle; }

        .shop-name { font-weight: 600; color: #111827; font-size: 13.5px; }
        .shop-email { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }
        .td-muted { color: #6b7280; font-size: 13px; }

        /* ROW ACTIONS */
        .row-actions { display: flex; align-items: center; gap: 6px; justify-content: flex-end; position: relative; }

        .view-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 7px;
          background: #f4f5f9; color: #374151;
          font-size: 12px; font-weight: 600; text-decoration: none;
          transition: all 0.14s; border: 1px solid #e2e5ed;
        }
        .view-btn:hover { background: #f0fdfa; color: #0d9488; border-color: #99f6e4; }

        .more-btn {
          width: 30px; height: 30px; border: 1px solid #e2e5ed; background: #fff;
          color: #9ca3af; border-radius: 7px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.14s;
        }
        .more-btn:hover { border-color: #d1d5db; color: #374151; background: #f9fafb; }

        /* DROPDOWN */
        .dropdown {
          position: fixed;
          background: #fff; border: 1px solid #e2e5ed; border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          min-width: 155px; z-index: 9999; overflow: hidden;
          animation: popIn 0.12s cubic-bezier(.4,0,.2,1);
        }
        @keyframes popIn { from { opacity: 0; transform: scale(0.96) translateY(-4px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        .dd-item {
          display: flex; align-items: center; gap: 8px;
          width: 100%; padding: 9px 13px;
          border: none; background: transparent;
          font-size: 13px; font-weight: 500; font-family: 'Outfit', sans-serif;
          cursor: pointer; transition: background 0.12s; text-align: left;
          color: #374151;
        }
        .dd-item:hover { background: #f4f5f9; }
        .dd-item.activate:hover { background: #f0fdf4; color: #15803d; }
        .dd-item.suspend:hover { background: #fffbeb; color: #b45309; }
        .dd-item.delete { color: #b91c1c; }
        .dd-item.delete:hover { background: #fef2f2; }
        .dd-divider { height: 1px; background: #f3f4f6; margin: 3px 0; }

        /* LOADING */
        .pr-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 60px; }
        .spin { width: 18px; height: 18px; border: 2px solid #e2e5ed; border-top-color: #0d9488; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* EMPTY */
        .empty-state { text-align: center; padding: 60px 24px; }
        .empty-ic { width: 52px; height: 52px; background: #f4f5f9; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
        .empty-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; color: #374151; }
        .empty-sub { font-size: 13px; color: #9ca3af; margin-top: 5px; }

        @media (max-width: 768px) {
          thead th:nth-child(3), tbody td:nth-child(3),
          thead th:nth-child(7), tbody td:nth-child(7) { display: none; }
          .filter-tabs { overflow-x: auto; }
        }
        @media (max-width: 520px) {
          thead th:nth-child(4), tbody td:nth-child(4) { display: none; }
        }
      `}</style>

      <div className="tp">
        {/* Top */}
        <div className="tp-top">
          <div>
            <div className="tp-title">All Tenants</div>
            <div className="tp-sub">
              {filteredCount} {statusFilter !== "all" ? statusFilter : "total"}{" "}
              tenant{filteredCount !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="tp-actions">
            <button className="icon-btn" onClick={fetchTenants} title="Refresh">
              <RefreshCw size={14} />
            </button>
            <Link to="/admin/tenants/add" className="add-btn">
              <Plus size={14} /> Add Tenant
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrap">
            <Search size={14} />
            <input
              className="search-input"
              type="text"
              placeholder="Search shop name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                className={`filter-tab ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {filterLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Table Card */}
        <div className="table-card">
          <div className="tc-hdr">
            <div className="tc-label">Tenant List</div>
            <span className="tc-count">{filteredCount} records</span>
          </div>

          {loading ? (
            <div className="pr-loading">
              <div className="spin" />
              <span style={{ fontSize: 13, color: "#9ca3af" }}>
                Loading tenants...
              </span>
            </div>
          ) : tenants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-ic">
                <Store size={22} color="#9ca3af" />
              </div>
              <div className="empty-title">No tenants found</div>
              <div className="empty-sub">
                Try adjusting your search or filter
              </div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Shop</th>
                    <th>Owner</th>
                    <th>Phone</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Expiry</th>
                    <th>Joined</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <div className="shop-name">{t.shopName}</div>
                        <div className="shop-email">{t.email}</div>
                      </td>
                      <td className="td-muted">{t.ownerName}</td>
                      <td className="td-muted">{t.phone || "—"}</td>
                      <td>
                        <PlanBadge plan={t.plan} />
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="td-muted">
                        {t.planExpiry
                          ? format(new Date(t.planExpiry), "MMM d, yyyy")
                          : "—"}
                      </td>
                      <td className="td-muted">
                        {format(new Date(t.createdAt), "MMM d, yyyy")}
                      </td>
                      <td>
                        <div
                          className="row-actions"
                          ref={openMenu === t._id ? menuRef : null}
                        >
                          <Link
                            to={`/admin/tenants/${t._id}`}
                            className="view-btn"
                          >
                            <Eye size={12} /> View
                          </Link>
                          <button
                            className="more-btn"
                            onClick={(e) => {
                              if (openMenu === t._id) {
                                setOpenMenu(null);
                                return;
                              }
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              setDropdownPos({
                                top: rect.bottom + 5,
                                left: rect.right - 155,
                              });
                              setOpenMenu(t._id);
                            }}
                          >
                            <MoreVertical size={14} />
                          </button>

                          {openMenu === t._id && (
                            <div
                              className="dropdown"
                              style={{
                                top: dropdownPos.top,
                                left: dropdownPos.left,
                              }}
                            >
                              {t.status !== "active" && (
                                <button
                                  className="dd-item activate"
                                  onClick={() =>
                                    handleStatusChange(t._id, "active")
                                  }
                                >
                                  <CheckCircle size={13} /> Activate
                                </button>
                              )}
                              {t.status !== "suspended" && (
                                <button
                                  className="dd-item suspend"
                                  onClick={() =>
                                    handleStatusChange(t._id, "suspended")
                                  }
                                >
                                  <Ban size={13} /> Suspend
                                </button>
                              )}
                              <div className="dd-divider" />
                              <button
                                className="dd-item delete"
                                onClick={() => handleDelete(t._id, t.shopName)}
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
