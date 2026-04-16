import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import SettingsOffcanvas from "./SettingsOffcanvas";
import NotificationOffcanvas from "./NotificationOffcanvas.jsx";
import "../css/main.css";
import api from "../api/api.js";
import { API_ENDPOINTS } from "../api/EndPoints.js";

// ── constants ──────────────────────────────────────────────────────────────
const SIDEBAR_W = 250;
const SIDEBAR_COL = 72;
const HEADER_H = 68;

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [customersOpen, setCustomersOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [shopName, setShopName] = useState("ShopPro");

  const { unreadCount } = useNotifications();
  const { theme, setTheme } = useTheme();
  const { user, logout, isOwner, isManager, isCashier, isStockKeeper } =
    useAuth();

  const isOwnerOrManager = isOwner || isManager;

  const toggleTheme = () =>
    setTheme({ ...theme, mode: theme.mode === "light" ? "dark" : "light" });

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  useEffect(() => {
    const fetchShopName = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.SHOP_SETTINGS);
        const data = res.data || {};
        if (data.shopName?.trim() && data.shopName !== "My Shop") {
          setShopName(data.shopName.trim());
          return;
        }
        const meRes = await api.get("/auth/me");
        const name =
          meRes.data?.tenant?.shopName || meRes.data?.owner?.shopName;
        if (name) setShopName(name);
      } catch {}
    };
    fetchShopName();
  }, []);

  const navCls = (isActive) =>
    `d-flex align-items-center rounded-3 mb-1 px-3 py-2 text-decoration-none ${
      isActive ? "bg-primary text-white shadow-sm" : "text-body"
    } ${isCollapsed ? "justify-content-center" : ""}`;

  const NavItem = ({ to, icon, label, end = false }) => (
    <NavLink
      to={to}
      end={end}
      onClick={() => setIsMobileOpen(false)}
      className={({ isActive }) => navCls(isActive)}
    >
      <i className={`bi ${icon} fs-5 ${isCollapsed ? "" : "me-3"}`}></i>
      <span className={isCollapsed ? "d-none" : "fw-medium"}>{label}</span>
    </NavLink>
  );

  const subNavCls = (isActive) =>
    `d-block py-2 px-3 rounded text-decoration-none small mb-1 ${isActive ? "bg-primary text-white" : "text-body"}`;

  return (
    <>
      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-box-arrow-right me-2 text-danger"></i>
                  Confirm Logout
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogoutModal(false)}
                ></button>
              </div>
              <div className="modal-body py-4">
                <p className="text-muted mb-0">
                  Are you sure you want to logout?
                </p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  className="btn btn-light px-4"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger px-4" onClick={confirmLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header
        className="bg-body shadow-sm border-bottom position-fixed w-100 top-0"
        style={{ zIndex: 1030 }}
      >
        <div className="container-fluid px-4 py-3">
          <div className="d-flex align-items-center justify-content-between">
            <button
              className="btn btn-link text-dark d-lg-none p-0 me-3"
              onClick={() => setIsMobileOpen(true)}
            >
              <i className="bi bi-list fs-3"></i>
            </button>

            {/* User Info */}
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: "36px",
                  height: "36px",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                {(user?.name || "U")[0].toUpperCase()}
              </div>
              <div className="d-none d-md-block">
                <small className="d-block fw-bold lh-1">
                  {user?.name || "User"}
                </small>
                <small
                  className="text-muted text-capitalize"
                  style={{ fontSize: "11px" }}
                >
                  {isOwner ? "Owner" : user?.role?.replace("_", " ") || "Staff"}
                </small>
              </div>
            </div>

            {/* Shop Name Center */}
            <div className="flex-grow-1 text-center d-none d-lg-block">
              <span className="fw-bold text-primary fs-5">{shopName}</span>
            </div>

            {/* Right Icons */}
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-link text-muted p-0 position-relative"
                onClick={() => setShowNotifications(true)}
              >
                <i className="bi bi-bell fs-4"></i>
                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "9px" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                className="btn btn-link text-muted p-0"
                onClick={toggleTheme}
              >
                <i
                  className={`bi fs-4 ${theme.mode === "light" ? "bi-moon-stars" : "bi-sun"}`}
                ></i>
              </button>
              <button
                className="btn btn-link text-danger p-0"
                onClick={() => setShowLogoutModal(true)}
                title="Logout"
              >
                <i className="bi bi-power fs-4"></i>
              </button>
              <button
                className="btn btn-link text-muted p-0"
                onClick={() => setShowSettings(true)}
              >
                <i className="bi bi-gear fs-4"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay — sirf mobile sidebar ke liye, z-index sidebar se kam */}
      {isMobileOpen && (
        <div
          className="position-fixed start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1024 }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR
          z-index: 1025  →  header (1030) se neeche,
                             offcanvas backdrop (~1040) se bhi neeche,
                             taake notification/settings offcanvas khulne par
                             sidebar bhi baaki screen ki tarah dim ho jaye.
      */}
      <div
        className={`d-flex flex-column bg-body-tertiary border-end shadow-sm position-fixed start-0 ${isMobileOpen ? "" : "d-none"} d-lg-flex`}
        style={{
          width: isCollapsed ? `${SIDEBAR_COL}px` : `${SIDEBAR_W}px`,
          transition: "width 0.3s ease",
          zIndex: 1025,
          top: `${HEADER_H}px`,
          height: `calc(100vh - ${HEADER_H}px)`,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Collapse Toggle */}
        <button
          className="btn btn-link text-body position-absolute d-none d-lg-block"
          style={{ top: "8px", right: "6px", zIndex: 1 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i
            className={`bi fs-5 ${isCollapsed ? "bi-arrow-right-square" : "bi-arrow-left-square"}`}
          ></i>
        </button>

        {/* Shop name in sidebar */}
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-2">
            <span className="fw-bold text-primary" style={{ fontSize: "15px" }}>
              {shopName}
            </span>
          </div>
        )}

        <nav
          className="flex-grow-1 px-2 pt-2 pb-3"
          style={{ marginTop: isCollapsed ? "40px" : "0" }}
        >
          {/* ══ OWNER / MANAGER ══ */}
          {isOwnerOrManager && (
            <>
              {/* 1. Dashboard */}
              <NavItem
                to="/shop"
                icon="bi-speedometer2"
                label="Dashboard"
                end
              />

              {/* 2. Products */}
              <NavItem to="/shop/products" icon="bi-bag" label="Products" />

              {/* 3. Categories */}
              <NavItem to="/shop/categories" icon="bi-tag" label="Categories" />

              {/* 4. Locations */}
              <NavItem
                to="/shop/locations"
                icon="bi-building"
                label="Locations"
              />

              {/* 5. Inventory */}
              <NavItem
                to="/shop/inventory"
                icon="bi-box-seam"
                label="Inventory"
              />

              {/* 6. Sales (dropdown) */}
              <div className="mb-1">
                <button
                  className={`d-flex align-items-center w-100 rounded-3 px-3 py-2 text-start text-body ${isCollapsed ? "justify-content-center" : ""}`}
                  onClick={() => setSalesOpen(!salesOpen)}
                  style={{ background: "none", border: "none" }}
                >
                  <i
                    className={`bi bi-cart fs-5 ${isCollapsed ? "" : "me-3"}`}
                  ></i>
                  <span className={isCollapsed ? "d-none" : "fw-medium"}>
                    Sales
                  </span>
                  {!isCollapsed && (
                    <i
                      className={`bi ms-auto fs-6 ${salesOpen ? "bi-chevron-down" : "bi-chevron-right"}`}
                    ></i>
                  )}
                </button>
                {!isCollapsed && salesOpen && (
                  <div className="ps-4 ms-1">
                    <NavLink
                      to="/shop/sales/pos"
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => subNavCls(isActive)}
                    >
                      POS Terminal
                    </NavLink>
                    <NavLink
                      to="/shop/sales/history"
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => subNavCls(isActive)}
                    >
                      Sales History
                    </NavLink>
                  </div>
                )}
              </div>

              {/* 7. Customers (dropdown) */}
              <div className="mb-1">
                <button
                  className={`d-flex align-items-center w-100 rounded-3 px-3 py-2 text-start text-body ${isCollapsed ? "justify-content-center" : ""}`}
                  onClick={() => setCustomersOpen(!customersOpen)}
                  style={{ background: "none", border: "none" }}
                >
                  <i
                    className={`bi bi-people fs-5 ${isCollapsed ? "" : "me-3"}`}
                  ></i>
                  <span className={isCollapsed ? "d-none" : "fw-medium"}>
                    Customers
                  </span>
                  {!isCollapsed && (
                    <i
                      className={`bi ms-auto fs-6 ${customersOpen ? "bi-chevron-down" : "bi-chevron-right"}`}
                    ></i>
                  )}
                </button>
                {!isCollapsed && customersOpen && (
                  <div className="ps-4 ms-1">
                    <NavLink
                      to="/shop/customers/cash"
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => subNavCls(isActive)}
                    >
                      Cash Customers
                    </NavLink>
                    <NavLink
                      to="/shop/customers/permanent-credit"
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => subNavCls(isActive)}
                    >
                      Credit Customers
                    </NavLink>
                    <NavLink
                      to="/shop/customers/temporary-credit"
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => subNavCls(isActive)}
                    >
                      Temporary Credits
                    </NavLink>
                  </div>
                )}
              </div>

              {/* 8. Reports */}
              <NavItem to="/shop/reports" icon="bi-graph-up" label="Reports" />

              {/* 9. Expenses */}
              <NavItem
                to="/shop/expenses"
                icon="bi-currency-exchange"
                label="Expenses"
              />

              {/* 10. Employees */}
              <NavItem
                to="/shop/employees"
                icon="bi-person-badge"
                label="Employees"
              />

              {/* 11. Settings */}
              <NavItem to="/shop/setting" icon="bi-gear" label="Settings" />
            </>
          )}

          {/* ══ CASHIER: sirf POS + History ══ */}
          {isCashier && (
            <>
              <NavItem
                to="/shop/sales/pos"
                icon="bi-cart-check"
                label="POS Terminal"
              />
              <NavItem
                to="/shop/sales/history"
                icon="bi-clock-history"
                label="Sales History"
              />
            </>
          )}

          {/* ══ STOCK KEEPER: sirf inventory related ══ */}
          {isStockKeeper && (
            <>
              <NavItem to="/shop/products" icon="bi-bag" label="Products" />
              <NavItem to="/shop/categories" icon="bi-tag" label="Categories" />
              <NavItem
                to="/shop/locations"
                icon="bi-building"
                label="Locations"
              />
              <NavItem
                to="/shop/inventory"
                icon="bi-box-seam"
                label="Inventory"
              />
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-3">
          {!isCollapsed && <hr className="border-secondary mx-2" />}
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`d-flex align-items-center w-100 rounded-3 px-3 py-2 text-danger ${isCollapsed ? "justify-content-center" : ""}`}
            style={{ background: "none", border: "none" }}
          >
            <i
              className={`bi bi-box-arrow-right fs-5 ${isCollapsed ? "" : "me-3"}`}
            ></i>
            <span className={isCollapsed ? "d-none" : "fw-medium"}>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN */}
      <main
        className="min-vh-100 bg-body"
        style={{
          marginLeft:
            window.innerWidth >= 992
              ? isCollapsed
                ? `${SIDEBAR_COL}px`
                : `${SIDEBAR_W}px`
              : "0",
          transition: "margin-left 0.3s ease",
          marginTop: `${HEADER_H}px`,
          padding: "20px",
        }}
      >
        <Outlet />
      </main>

      <SettingsOffcanvas
        show={showSettings}
        handleClose={() => setShowSettings(false)}
      />
      <NotificationOffcanvas
        show={showNotifications}
        handleClose={() => setShowNotifications(false)}
      />
    </>
  );
}
