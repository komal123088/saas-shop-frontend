import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  Bell,
  Clock,
  Menu,
  Shield,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/admin/pending", icon: Clock, label: "Pending Requests" },
  { to: "/admin/tenants", icon: Users, label: "Tenants" },
  { to: "/admin/plans", icon: CreditCard, label: "Plans & Pricing" },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const getPageInfo = () => {
    const p = location.pathname;
    if (p === "/admin")
      return { title: "Dashboard", sub: "Platform overview & live analytics" };
    if (p === "/admin/pending")
      return {
        title: "Pending Requests",
        sub: "Review and approve new registrations",
      };
    if (p === "/admin/tenants/add")
      return { title: "Add Tenant", sub: "Create a new tenant account" };
    if (p.startsWith("/admin/tenants/"))
      return { title: "Tenant Details", sub: "View and manage tenant info" };
    if (p === "/admin/tenants")
      return { title: "All Tenants", sub: "Manage registered businesses" };
    if (p === "/admin/plans")
      return { title: "Plans & Pricing", sub: "Configure subscription plans" };
    return { title: "Dashboard", sub: "" };
  };

  const { title, sub } = getPageInfo();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --sidebar-w: 248px;
          --header-h: 64px;
          --bg: #f4f5f9;
          --sidebar-bg: #ffffff;
          --border: #e2e5ed;
          --card: #ffffff;
          --accent: #0d9488;
          --accent-hover: #0f766e;
          --accent-bg: #f0fdfa;
          --accent-mid: #99f6e4;
          --accent-text: #0f766e;
          --text-1: #111827;
          --text-2: #4b5563;
          --text-3: #9ca3af;
          --red: #ef4444;
          --amber: #f59e0b;
          --blue: #3b82f6;
          --shadow: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
        }

        body { background: var(--bg); font-family: 'Outfit', sans-serif; color: var(--text-1); -webkit-font-smoothing: antialiased; }

        .shell { display: flex; min-height: 100vh; }

        /* ─── SIDEBAR ─── */
        .sb {
          width: var(--sidebar-w);
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; bottom: 0;
          z-index: 200;
          transition: transform 0.25s cubic-bezier(.4,0,.2,1);
          box-shadow: var(--shadow);
        }

        .sb-top {
          height: var(--header-h);
          display: flex; align-items: center; gap: 10px;
          padding: 0 18px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .sb-icon {
          width: 35px; height: 35px;
          background: var(--accent);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(13,148,136,0.28);
        }
        .sb-icon svg { color: #fff; }

        .sb-brand { font-family: 'Fraunces', serif; font-weight: 700; font-size: 16px; color: var(--text-1); letter-spacing: -0.2px; }
        .sb-role { font-size: 11px; color: var(--text-3); margin-top: 1px; }

        .sb-nav { flex: 1; padding: 14px 10px; overflow-y: auto; }

        .sb-section { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--text-3); padding: 0 8px; margin-bottom: 5px; }

        .nav-a {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 10px; border-radius: 8px;
          color: var(--text-2); text-decoration: none;
          font-size: 13.5px; font-weight: 500;
          transition: all 0.14s;
          margin-bottom: 2px;
          position: relative;
        }
        .nav-a:hover { background: var(--bg); color: var(--text-1); }
        .nav-a.on { background: var(--accent-bg); color: var(--accent-text); font-weight: 600; }
        .nav-a.on svg { color: var(--accent); }
        .nav-a.on::before {
          content: ''; position: absolute;
          left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 18px;
          background: var(--accent); border-radius: 0 3px 3px 0;
        }
        .nav-a svg { opacity: 0.75; flex-shrink: 0; }
        .nav-a.on svg { opacity: 1; }

        .sb-foot { padding: 10px; border-top: 1px solid var(--border); flex-shrink: 0; }

        .u-card {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 10px; border-radius: 9px;
          background: var(--bg);
        }

        .u-ava {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, var(--accent) 0%, #14b8a6 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Fraunces', serif; font-weight: 600; font-size: 13px; color: #fff;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(13,148,136,0.22);
        }

        .u-info { flex: 1; min-width: 0; }
        .u-name { font-size: 12.5px; font-weight: 600; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .u-tag {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 10px; font-weight: 500; color: var(--accent-text);
          background: var(--accent-bg); border: 1px solid var(--accent-mid);
          padding: 1px 6px; border-radius: 20px; margin-top: 2px;
        }

        .lo-btn {
          width: 28px; height: 28px;
          border: 1px solid var(--border); background: #fff;
          color: var(--text-3); border-radius: 7px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.14s; flex-shrink: 0;
        }
        .lo-btn:hover { background: #fef2f2; border-color: #fca5a5; color: var(--red); }

        /* ─── MAIN ─── */
        .main { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

        .hdr {
          height: var(--header-h);
          background: rgba(244,245,249,0.92);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(8px);
        }

        .hdr-l { display: flex; align-items: center; gap: 12px; }
        .h-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--text-1); letter-spacing: -0.3px; }
        .h-sub { font-size: 11.5px; color: var(--text-3); margin-top: 1px; }

        .hdr-r { display: flex; align-items: center; gap: 8px; }

        .hdr-btn {
          width: 36px; height: 36px;
          border: 1px solid var(--border); background: var(--card);
          color: var(--text-2); border-radius: 9px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.14s; position: relative;
          box-shadow: var(--shadow);
        }
        .hdr-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }

        .notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 6px; height: 6px;
          background: var(--red); border-radius: 50%;
          border: 1.5px solid var(--bg);
        }

        .hdr-sep { width: 1px; height: 20px; background: var(--border); }

        .hdr-pill {
          display: flex; align-items: center; gap: 7px;
          padding: 4px 12px 4px 4px;
          border: 1px solid var(--border); background: var(--card);
          border-radius: 999px; box-shadow: var(--shadow);
        }

        .hdr-ava {
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), #14b8a6);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Fraunces', serif; font-weight: 600; font-size: 11px; color: #fff;
        }

        .hdr-uname { font-size: 13px; font-weight: 600; color: var(--text-1); }

        .mob-btn {
          display: none; width: 36px; height: 36px;
          border: 1px solid var(--border); background: var(--card);
          color: var(--text-2); border-radius: 9px;
          cursor: pointer; align-items: center; justify-content: center;
          box-shadow: var(--shadow);
        }

        .content { flex: 1; padding: 28px; }

        .overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(17,24,39,0.3); z-index: 199;
          backdrop-filter: blur(2px);
        }

        /* scrollbar */
        .sb-nav::-webkit-scrollbar { width: 3px; }
        .sb-nav::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        @media (max-width: 768px) {
          .sb { transform: translateX(-100%); box-shadow: none; }
          .sb.open { transform: translateX(0); box-shadow: 0 8px 40px rgba(0,0,0,0.18); }
          .overlay.open { display: block; }
          .main { margin-left: 0; }
          .mob-btn { display: flex; }
          .content { padding: 18px 14px; }
          .hdr { padding: 0 14px; }
          .hdr-uname { display: none; }
        }
      `}</style>

      <div className="shell">
        <div
          className={`overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* SIDEBAR */}
        <aside className={`sb ${sidebarOpen ? "open" : ""}`}>
          <div className="sb-top">
            <div className="sb-icon">
              <Zap size={17} />
            </div>
            <div>
              <div className="sb-brand">ShopSaaS</div>
              <div className="sb-role">Admin Console</div>
            </div>
          </div>

          <nav className="sb-nav">
            <div className="sb-section" style={{ marginBottom: 8 }}>
              Navigation
            </div>
            {navItems.map(({ to, icon: Icon, label, exact }) => {
              const isActive = exact
                ? location.pathname === to
                : location.pathname === to ||
                  location.pathname.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  className={`nav-a ${isActive ? "on" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="sb-foot">
            <div className="u-card">
              <div className="u-ava">
                {admin?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="u-info">
                <div className="u-name">{admin?.name || "Admin"}</div>
                <div className="u-tag">
                  <Shield size={8} /> Super Admin
                </div>
              </div>
              <button className="lo-btn" onClick={handleLogout} title="Logout">
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <header className="hdr">
            <div className="hdr-l">
              <button className="mob-btn" onClick={() => setSidebarOpen(true)}>
                <Menu size={17} />
              </button>
              <div>
                <div className="h-title">{title}</div>
                {sub && <div className="h-sub">{sub}</div>}
              </div>
            </div>
            <div className="hdr-r">
              <button className="hdr-btn">
                <Bell size={15} />
                <span className="notif-dot" />
              </button>
              <div className="hdr-sep" />
              <div className="hdr-pill">
                <div className="hdr-ava">
                  {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <span className="hdr-uname">{admin?.name || "Admin"}</span>
              </div>
            </div>
          </header>

          <main className="content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
