import { useState, useEffect, useRef } from "react";
import api from "../api/api";
import { useNotifications } from "../context/NotificationContext";
import { API_ENDPOINTS } from "../api/EndPoints";
import QRCode from "qrcode";
import BackupButton from "../components/BackupButton";
import NetworkInfo from "../components/NetworkInfo";

export default function Setting() {
  const [formData, setFormData] = useState({
    shopName: "",
    address: "",
    location: "",
    phone: "",
    email: "",
    about: "",
    logo: null,
  });
  const [profile, setProfile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [activeTab, setActiveTab] = useState("account");

  const { addNotification } = useNotifications();
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          api.get(API_ENDPOINTS.SHOP_SETTINGS),
          api.get("/auth/me"),
        ]);
        const data = settingsRes.data || {};
        const prof = profileRes.data;
        setProfile(prof);
        setFormData({
          shopName:
            data.shopName && data.shopName !== "My Shop"
              ? data.shopName
              : prof?.owner?.shopName || "",
          address: data.address?.trim() || "",
          location: data.location?.trim() || "",
          phone:
            data.phone && data.phone !== "03xx-xxxxxxx"
              ? data.phone
              : prof?.owner?.phone || "",
          email: data.email?.trim() || prof?.owner?.email || "",
          about: data.about?.trim() || "",
          logo: null,
        });
        if (data.logo) {
          const logoUrl = data.logo.startsWith("http")
            ? data.logo
            : `${window.location.protocol}//${window.location.hostname}:3000${data.logo}`;
          setPreviewLogo(logoUrl);
        }
        setLoading(false);
      } catch (err) {
        addNotification("error", "Failed to load settings");
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      form.append("shopName", formData.shopName);
      form.append("address", formData.address);
      form.append("location", formData.location);
      form.append("phone", formData.phone);
      form.append("email", formData.email);
      form.append("about", formData.about);
      if (formData.logo) form.append("logo", formData.logo);
      await api.post(API_ENDPOINTS.SHOP_SETTINGS, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      addNotification("success", "Settings saved successfully!");
      setFormData((prev) => ({ ...prev, logo: null }));
    } catch (err) {
      addNotification("error", "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const generateQR = async () => {
    try {
      setShowQR(true);
      let ip = "192.168.1.1";
      try {
        const res = await api.get("/local-ip");
        ip = res.data.ip;
      } catch {
        const h = window.location.hostname;
        if (h !== "localhost" && h !== "127.0.0.1") ip = h;
      }
      const url = `http://${ip}:5173`;
      setQrUrl(url);
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, url, {
          width: 220,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
        });
      }
    } catch {
      addNotification("error", "Failed to generate QR code");
    }
  };

  const getDaysRemaining = (expiry) => {
    if (!expiry) return null;
    return Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysRemaining(profile?.tenant?.planExpiry);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-PK", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  const tabs = [
    { id: "account", label: "Account", icon: "bi-person-circle" },
    { id: "shop", label: "Shop Config", icon: "bi-shop" },
    { id: "mobile", label: "Mobile Access", icon: "bi-phone" },
    { id: "tools", label: "Tools", icon: "bi-tools" },
  ];

  return (
    <div className="container-fluid py-4" style={{ maxWidth: "1100px" }}>
      {/* Page Header */}
      <div className="d-flex align-items-center mb-4">
        <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
          <i className="bi bi-gear-fill text-primary fs-4"></i>
        </div>
        <div>
          <h4 className="fw-bold mb-0">Settings</h4>
          <small className="text-muted">
            Manage your account, shop, and preferences
          </small>
        </div>
      </div>

      {/* Tabs Nav */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="d-flex border-bottom overflow-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn btn-link text-decoration-none px-4 py-3 rounded-0 border-0 fw-medium"
                style={{
                  color: activeTab === tab.id ? "#0d6efd" : "#6c757d",
                  borderBottom:
                    activeTab === tab.id
                      ? "2px solid #0d6efd"
                      : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                <i className={`bi ${tab.icon} me-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── ACCOUNT TAB ── */}
      {activeTab === "account" && profile && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <i className="bi bi-person-fill text-primary fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Owner Profile</h6>
                    <small className="text-muted">Your account details</small>
                  </div>
                </div>
                <div className="list-group list-group-flush">
                  {[
                    { label: "Full Name", value: profile.owner?.name },
                    { label: "Email", value: profile.owner?.email },
                    { label: "Phone", value: profile.owner?.phone },
                    { label: "Shop Name", value: profile.owner?.shopName },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="list-group-item px-0 d-flex justify-content-between align-items-center border-0 border-bottom py-3"
                    >
                      <span className="text-muted small">{item.label}</span>
                      <span className="fw-medium text-end">
                        {item.value || "—"}
                      </span>
                    </div>
                  ))}
                  <div className="list-group-item px-0 d-flex justify-content-between align-items-center border-0 py-3">
                    <span className="text-muted small">Tenant ID</span>
                    <code className="bg-light px-2 py-1 rounded border small">
                      {profile.tenant?.tenantId || "—"}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                    <i className="bi bi-credit-card-fill text-success fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Subscription</h6>
                    <small className="text-muted">Plan & billing info</small>
                  </div>
                </div>

                <div className="text-center py-3 bg-light rounded mb-4">
                  <span
                    className={`badge fs-6 px-4 py-2 ${
                      profile.tenant?.plan?.name === "premium"
                        ? "bg-warning text-dark"
                        : profile.tenant?.plan?.name === "standard"
                          ? "bg-primary"
                          : "bg-secondary"
                    } text-capitalize`}
                  >
                    <i className="bi bi-star-fill me-2"></i>
                    {profile.tenant?.plan?.name || "Free"} Plan
                  </span>
                  {profile.tenant?.plan?.price && (
                    <div className="mt-2 text-muted small">
                      PKR {profile.tenant?.plan?.price?.toLocaleString()} /
                      month
                    </div>
                  )}
                </div>

                <div className="list-group list-group-flush">
                  <div className="list-group-item px-0 d-flex justify-content-between align-items-center border-0 border-bottom py-3">
                    <span className="text-muted small">Status</span>
                    <span
                      className={`badge ${profile.tenant?.status === "active" ? "bg-success" : "bg-danger"}`}
                    >
                      <i
                        className={`bi ${profile.tenant?.status === "active" ? "bi-check-circle" : "bi-x-circle"} me-1`}
                      ></i>
                      {profile.tenant?.status}
                    </span>
                  </div>
                  <div className="list-group-item px-0 d-flex justify-content-between align-items-center border-0 border-bottom py-3">
                    <span className="text-muted small">Start Date</span>
                    <span className="fw-medium">
                      {formatDate(profile.tenant?.planStartDate)}
                    </span>
                  </div>
                  <div className="list-group-item px-0 d-flex justify-content-between align-items-center border-0 border-bottom py-3">
                    <span className="text-muted small">Expiry Date</span>
                    <span className="fw-medium">
                      {formatDate(profile.tenant?.planExpiry)}
                    </span>
                  </div>
                  {daysLeft !== null && (
                    <div className="list-group-item px-0 d-flex justify-content-between align-items-center border-0 py-3">
                      <span className="text-muted small">Remaining</span>
                      <span
                        className={`badge ${daysLeft <= 7 ? "bg-danger" : daysLeft <= 30 ? "bg-warning text-dark" : "bg-success"}`}
                      >
                        {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SHOP CONFIG TAB ── */}
      {activeTab === "shop" && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                <i className="bi bi-shop text-primary fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0">Shop Configuration</h6>
                <small className="text-muted">
                  Update your shop info and branding
                </small>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Logo */}
                <div className="col-12">
                  <div className="d-flex align-items-center gap-4 p-3 bg-light rounded">
                    {previewLogo ? (
                      <img
                        src={previewLogo}
                        alt="Logo"
                        className="rounded-circle border"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/default-shop-logo.png";
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-white border d-flex align-items-center justify-content-center"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <i className="bi bi-shop fs-3 text-muted"></i>
                      </div>
                    )}
                    <div>
                      <label className="fw-medium d-block mb-1">
                        Shop Logo
                      </label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        style={{ width: "260px" }}
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                      <small className="text-muted">
                        PNG/JPG, max 2MB, 1:1 ratio
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Shop Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Phone <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    City / Location
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-geo-alt"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Lahore, Punjab"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium">Full Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address, area..."
                  ></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium">About Shop</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="Brief description of your shop..."
                  ></textarea>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                <button
                  type="submit"
                  className="btn btn-primary px-5"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MOBILE ACCESS TAB ── */}
      {activeTab === "mobile" && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4">
              <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                <i className="bi bi-phone-fill text-info fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0">Mobile Access</h6>
                <small className="text-muted">
                  Open this app on your phone via WiFi
                </small>
              </div>
            </div>
            <div className="row align-items-center g-4">
              <div className="col-md-7">
                <div className="bg-light rounded p-4 mb-3">
                  <h6 className="fw-bold mb-3">How to connect?</h6>
                  <ol className="mb-0 ps-3">
                    <li className="mb-2">
                      Make sure your phone is on the <strong>same WiFi</strong>{" "}
                      as this PC
                    </li>
                    <li className="mb-2">
                      Click <strong>"Generate QR"</strong> button
                    </li>
                    <li className="mb-2">
                      Open camera on phone and <strong>scan the QR code</strong>
                    </li>
                    <li>App will open in your phone browser</li>
                  </ol>
                </div>
                {qrUrl && (
                  <div className="p-3 bg-light rounded d-flex align-items-center gap-3">
                    <i className="bi bi-link-45deg text-primary fs-5"></i>
                    <code className="small flex-grow-1">{qrUrl}</code>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        navigator.clipboard.writeText(qrUrl);
                        addNotification("success", "Copied!");
                      }}
                    >
                      <i className="bi bi-clipboard"></i>
                    </button>
                  </div>
                )}
                <div className="mt-3">
                  <NetworkInfo />
                </div>
              </div>
              <div className="col-md-5 text-center">
                {showQR ? (
                  <div>
                    <div className="bg-white p-3 rounded border shadow-sm d-inline-block">
                      <canvas ref={canvasRef}></canvas>
                    </div>
                    <p className="text-muted small mt-2 mb-0">
                      <i className="bi bi-wifi me-1"></i>Same WiFi required
                    </p>
                  </div>
                ) : (
                  <div
                    className="bg-light rounded p-5 mb-3"
                    style={{ border: "2px dashed #dee2e6" }}
                  >
                    <i
                      className="bi bi-qr-code text-muted"
                      style={{ fontSize: "4rem" }}
                    ></i>
                    <p className="text-muted small mt-2 mb-0">
                      QR code will appear here
                    </p>
                  </div>
                )}
                <button className="btn btn-primary mt-3" onClick={generateQR}>
                  <i className="bi bi-qr-code-scan me-2"></i>
                  {showQR ? "Regenerate QR" : "Generate QR Code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOOLS TAB ── */}
      {activeTab === "tools" && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-cloud-download fs-4 text-success me-3"></i>
                  <div>
                    <h6 className="mb-0 fw-bold">Backup Data</h6>
                    <small className="text-muted">Export all shop data</small>
                  </div>
                </div>
                <p className="text-muted small mb-3">
                  Download a complete backup of your products, sales, customers
                  and settings.
                </p>
                <BackupButton />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-info-circle fs-4 text-info me-3"></i>
                  <div>
                    <h6 className="mb-0 fw-bold">System Info</h6>
                    <small className="text-muted">App version & details</small>
                  </div>
                </div>
                <div className="list-group list-group-flush">
                  {[
                    {
                      label: "Version",
                      value: <span className="badge bg-primary">v1.0.0</span>,
                    },
                    {
                      label: "Tenant ID",
                      value: (
                        <code className="small">
                          {profile?.tenant?.tenantId || "—"}
                        </code>
                      ),
                    },
                    {
                      label: "Plan",
                      value: (
                        <span className="text-capitalize fw-medium">
                          {profile?.tenant?.plan?.name || "—"}
                        </span>
                      ),
                    },
                    {
                      label: "Status",
                      value: (
                        <span
                          className={`badge ${profile?.tenant?.status === "active" ? "bg-success" : "bg-danger"}`}
                        >
                          {profile?.tenant?.status}
                        </span>
                      ),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="list-group-item px-0 d-flex justify-content-between align-items-center border-0 border-bottom py-3"
                    >
                      <span className="text-muted small">{item.label}</span>
                      {item.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
