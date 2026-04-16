import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CheckCircle,
  X,
  RefreshCw,
  Clock,
  Store,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Key,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

const API_URL = `${import.meta.env.VITE_REACT_BACKEND_BASE}/saas`;
const getToken = () => localStorage.getItem("admin_token");

export default function PendingRegistrationsPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveModal, setApproveModal] = useState(null);
  const [months, setMonths] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [lastApproved, setLastApproved] = useState(null);

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/registrations/pending`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPending(res.data);
    } catch {
      toast.error("Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/registrations/approve/${approveModal._id}`,
        { months: Number(months) },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      toast.success("Approved! Email sent to user.");
      setLastApproved({
        tenant: approveModal,
        tempPassword: res.data.tempPassword,
      });
      setApproveModal(null);
      loadPending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id, shopName) => {
    if (!window.confirm(`Reject "${shopName}"?`)) return;
    try {
      await axios.post(
        `${API_URL}/registrations/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      toast.success("Registration rejected");
      loadPending();
    } catch {
      toast.error("Failed to reject");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Outfit:wght@400;500;600;700&display=swap');
        .pr * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }

        /* TOP BAR */
        .pr-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; flex-wrap: wrap; gap: 12px; }
        .pr-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: #111827; letter-spacing: -0.3px; }
        .pr-sub { font-size: 13px; color: #9ca3af; margin-top: 3px; }

        .refresh-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          border: 1px solid #e2e5ed; background: #fff;
          color: #374151; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.14s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .refresh-btn:hover { border-color: #0d9488; color: #0d9488; background: #f0fdfa; }

        /* SUCCESS BANNER */
        .success-banner {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
          padding: 14px 18px; border-radius: 12px; margin-bottom: 20px;
          background: #f0fdf4; border: 1px solid #a7f3d0;
        }
        .banner-inner { display: flex; align-items: flex-start; gap: 10px; }
        .banner-icon { color: #10b981; flex-shrink: 0; margin-top: 1px; }
        .banner-title { font-size: 13.5px; font-weight: 600; color: #065f46; }
        .banner-pass {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12.5px; color: #047857; margin-top: 5px;
          background: #dcfce7; border: 1px solid #a7f3d0;
          padding: 3px 10px; border-radius: 7px;
        }
        .banner-pass strong { font-family: 'Courier New', monospace; font-size: 13px; letter-spacing: 0.5px; }
        .banner-close {
          width: 24px; height: 24px; border: none; background: transparent;
          color: #6ee7b7; cursor: pointer; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.13s; flex-shrink: 0;
        }
        .banner-close:hover { background: #d1fae5; color: #065f46; }

        /* LOADING */
        .pr-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 60px; }
        .spin { width: 18px; height: 18px; border: 2px solid #e2e5ed; border-top-color: #0d9488; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* EMPTY */
        .empty-card {
          background: #fff; border: 1px solid #e2e5ed; border-radius: 14px;
          text-align: center; padding: 60px 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .empty-ic { width: 54px; height: 54px; background: #f0fdf4; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
        .empty-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; color: #374151; }
        .empty-sub { font-size: 13px; color: #9ca3af; margin-top: 5px; }

        /* TABLE CARD */
        .table-card { background: #fff; border: 1px solid #e2e5ed; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .tc-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f3f4f6; }
        .tc-title { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; color: #111827; }
        .tc-count { font-size: 12px; font-weight: 600; color: #f59e0b; background: #fffbeb; border: 1px solid #fde68a; padding: 2px 9px; border-radius: 20px; }

        table { width: 100%; border-collapse: collapse; }
        thead th {
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.7px;
          text-transform: uppercase; color: #9ca3af;
          padding: 10px 16px; text-align: left;
          background: #fafafa; border-bottom: 1px solid #f3f4f6;
        }
        tbody tr { border-bottom: 1px solid #f9fafb; transition: background 0.1s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #fafafa; }
        tbody td { padding: 14px 16px; font-size: 13.5px; color: #374151; vertical-align: middle; }

        .shop-name { font-weight: 600; color: #111827; font-size: 13.5px; }
        .shop-email { font-size: 11.5px; color: #9ca3af; margin-top: 2px; display: flex; align-items: center; gap: 3px; }

        .plan-badge {
          display: inline-block; padding: 2px 9px; border-radius: 20px;
          font-size: 11.5px; font-weight: 600;
          background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4;
        }

        .date-text { font-size: 13px; color: #374151; }
        .time-text { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }

        .action-wrap { display: flex; gap: 7px; }

        .approve-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 8px;
          background: #f0fdf4; color: #15803d;
          border: 1px solid #a7f3d0; font-size: 12.5px; font-weight: 600;
          cursor: pointer; transition: all 0.14s;
        }
        .approve-btn:hover { background: #dcfce7; border-color: #6ee7b7; }

        .reject-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 8px;
          background: #fef2f2; color: #b91c1c;
          border: 1px solid #fecaca; font-size: 12.5px; font-weight: 600;
          cursor: pointer; transition: all 0.14s;
        }
        .reject-btn:hover { background: #fee2e2; border-color: #fca5a5; }

        /* MODAL OVERLAY */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(17,24,39,0.35);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadein 0.15s ease;
        }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }

        .modal-box {
          background: #fff; border-radius: 16px; width: 100%; max-width: 440px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          animation: slideup 0.18s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slideup { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .modal-hdr {
          padding: 20px 22px 16px;
          border-bottom: 1px solid #f3f4f6;
          display: flex; align-items: center; justify-content: space-between;
        }
        .modal-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: #111827; }
        .modal-close {
          width: 28px; height: 28px; border: 1px solid #e2e5ed; background: #fff;
          color: #9ca3af; border-radius: 7px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all 0.13s;
        }
        .modal-close:hover { background: #fef2f2; border-color: #fca5a5; color: #ef4444; }

        .modal-body { padding: 20px 22px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
        .info-item {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 10px 12px; border-radius: 9px;
          background: #f9fafb; border: 1px solid #f3f4f6;
        }
        .info-icon { color: #9ca3af; flex-shrink: 0; margin-top: 1px; }
        .info-label { font-size: 10.5px; color: #9ca3af; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-val { font-size: 13px; font-weight: 600; color: #111827; margin-top: 1px; }

        .dur-label { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 7px; }
        .dur-select {
          width: 100%; padding: 9px 12px; border-radius: 9px;
          border: 1px solid #e2e5ed; font-size: 13.5px; font-weight: 500;
          color: #111827; background: #fff; outline: none;
          transition: border 0.14s; font-family: 'Outfit', sans-serif;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          padding-right: 34px;
        }
        .dur-select:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }

        .modal-footer {
          padding: 14px 22px;
          border-top: 1px solid #f3f4f6;
          display: flex; gap: 8px; justify-content: flex-end;
        }

        .cancel-btn {
          padding: 9px 18px; border-radius: 9px;
          border: 1px solid #e2e5ed; background: #fff;
          color: #374151; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.14s; font-family: 'Outfit', sans-serif;
        }
        .cancel-btn:hover { background: #f9fafb; }

        .confirm-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 18px; border-radius: 9px;
          background: #0d9488; color: #fff;
          border: none; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background 0.14s;
          font-family: 'Outfit', sans-serif;
          box-shadow: 0 2px 8px rgba(13,148,136,0.25);
        }
        .confirm-btn:hover:not(:disabled) { background: #0f766e; }
        .confirm-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        @media (max-width: 640px) {
          thead th:nth-child(3), tbody td:nth-child(3),
          thead th:nth-child(5), tbody td:nth-child(5) { display: none; }
          .info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="pr">
        {/* Top */}
        <div className="pr-top">
          <div>
            <div className="pr-title">Pending Registrations</div>
            <div className="pr-sub">
              {pending.length} request{pending.length !== 1 ? "s" : ""} waiting
              for approval
            </div>
          </div>
          <button className="refresh-btn" onClick={loadPending}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Success Banner */}
        {lastApproved && (
          <div className="success-banner">
            <div className="banner-inner">
              <CheckCircle size={16} className="banner-icon" />
              <div>
                <div className="banner-title">
                  {lastApproved.tenant.shopName} approved successfully!
                </div>
                <div className="banner-pass">
                  <Key size={11} />
                  Temporary password:{" "}
                  <strong>{lastApproved.tempPassword}</strong>
                </div>
              </div>
            </div>
            <button
              className="banner-close"
              onClick={() => setLastApproved(null)}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="pr-loading">
            <div className="spin" />
            <span style={{ fontSize: 13, color: "#9ca3af" }}>
              Loading requests...
            </span>
          </div>
        ) : pending.length === 0 ? (
          /* Empty */
          <div className="empty-card">
            <div className="empty-ic">
              <CheckCircle size={22} color="#10b981" />
            </div>
            <div className="empty-title">All caught up!</div>
            <div className="empty-sub">
              No pending registrations at the moment.
            </div>
          </div>
        ) : (
          /* Table */
          <div className="table-card">
            <div className="tc-head">
              <div className="tc-title">Awaiting Approval</div>
              <span className="tc-count">{pending.length} pending</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Shop</th>
                  <th>Owner</th>
                  <th>Phone</th>
                  <th>Plan</th>
                  <th>Submitted</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div className="shop-name">{t.shopName}</div>
                      <div className="shop-email">
                        <Mail size={10} /> {t.email}
                      </div>
                    </td>
                    <td>{t.ownerName}</td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>
                      {t.phone || "—"}
                    </td>
                    <td>
                      {t.plan?.name ? (
                        <span className="plan-badge">{t.plan.name}</span>
                      ) : (
                        <span style={{ color: "#d1d5db" }}>—</span>
                      )}
                    </td>
                    <td>
                      <div className="date-text">
                        {format(new Date(t.createdAt), "MMM d, yyyy")}
                      </div>
                      <div className="time-text">
                        {format(new Date(t.createdAt), "h:mm a")}
                      </div>
                    </td>
                    <td>
                      <div
                        className="action-wrap"
                        style={{ justifyContent: "flex-end" }}
                      >
                        <button
                          className="approve-btn"
                          onClick={() => setApproveModal(t)}
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleReject(t._id, t.shopName)}
                        >
                          <X size={12} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Approve Modal */}
        {approveModal && (
          <div
            className="modal-overlay"
            onClick={(e) =>
              e.target === e.currentTarget && setApproveModal(null)
            }
          >
            <div className="modal-box">
              <div className="modal-hdr">
                <div className="modal-title">Approve Registration</div>
                <button
                  className="modal-close"
                  onClick={() => setApproveModal(null)}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="modal-body">
                {/* Info Grid */}
                <div className="info-grid">
                  <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                    <Store size={14} className="info-icon" />
                    <div>
                      <div className="info-label">Shop Name</div>
                      <div className="info-val">{approveModal.shopName}</div>
                    </div>
                  </div>
                  <div className="info-item">
                    <User size={14} className="info-icon" />
                    <div>
                      <div className="info-label">Owner</div>
                      <div className="info-val">{approveModal.ownerName}</div>
                    </div>
                  </div>
                  <div className="info-item">
                    <CreditCard size={14} className="info-icon" />
                    <div>
                      <div className="info-label">Plan</div>
                      <div className="info-val">
                        {approveModal.plan?.name || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                    <Mail size={14} className="info-icon" />
                    <div>
                      <div className="info-label">Email</div>
                      <div className="info-val">{approveModal.email}</div>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="dur-label">Subscription Duration</div>
                <select
                  className="dur-select"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                >
                  {[1, 2, 3, 6, 12].map((m) => (
                    <option key={m} value={m}>
                      {m} Month{m > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setApproveModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-btn"
                  onClick={handleApprove}
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
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={13} /> Approve & Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
