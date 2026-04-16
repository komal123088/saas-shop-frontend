import { useState, useEffect } from "react";
import api from "../../api/api";
import Barcode from "react-barcode";
import JsBarcode from "jsbarcode"; // ✅ Direct import — Vite bundle karega, CDN nahi
import { API_ENDPOINTS } from "../../api/EndPoints";
import { useNotifications } from "../../context/NotificationContext";
import "./product.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 25;

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    categoryId: "",
    categoryName: "",
    supplier: "",
    locationId: "",
    locationName: "",
    stock: 0,
    costPrice: 0,
    salePrice: 0,
    minStockAlert: 10,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(
        () => setAlert({ show: false, type: "", message: "" }),
        2000,
      );
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchLocations();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.PRODUCTS);
      const productsData = res.data.products || res.data || [];
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading products:", err);
      notify("error", "Error loading products");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.CATEGORIES);
      setCategories(res.data.filter((c) => c.isActive) || []);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.LOCATIONS);
      setLocations(res.data.filter((l) => l.isActive) || []);
    } catch (err) {
      console.error("Failed to load locations");
    }
  };

  const getCategoryName = (category) => {
    if (!category) return "—";
    if (typeof category === "object") return category.name || "—";
    const found = categories.find(
      (c) => c._id === category || c.name === category,
    );
    return found ? found.name : category;
  };

  const getLocationName = (location) => {
    if (!location) return "—";
    if (typeof location === "object") return location.name || "—";
    const found = locations.find(
      (l) => l._id === location || l.name === location,
    );
    return found ? found.name : location;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
      return imagePath;
    if (imagePath.startsWith("data:")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    const baseURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3000";
    return `${baseURL}${cleanPath}`;
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = products.filter((p) => {
      const catName = getCategoryName(p.category).toLowerCase();
      return (
        p.name?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query) ||
        p.barcode?.includes(query) ||
        catName.includes(query)
      );
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, products]);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (page) => setCurrentPage(page);

  const notify = (type, message) => {
    setAlert({ show: true, type, message });
    addNotification(type, message);
  };

  const generateBarcode = () => {
    let code = Math.floor(Math.random() * 900000000000) + 100000000000;
    code = code.toString();
    let sum = 0;
    for (let i = 0; i < 12; i++)
      sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
    const checksum = (10 - (sum % 10)) % 10;
    return code + checksum;
  };

  // ✅ Canvas pe barcode render karo — React app ke andar, koi CDN nahi
  const makeBarcodeImage = (barcodeValue) => {
    try {
      const canvas = document.createElement("canvas");
      const isEAN13 = /^\d{13}$/.test(barcodeValue);
      JsBarcode(canvas, barcodeValue, {
        format: isEAN13 ? "EAN13" : "CODE128",
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 13,
        margin: 10,
        background: "#ffffff",
        lineColor: "#000000",
      });
      return canvas.toDataURL("image/png"); // ✅ Pure base64 PNG — koi network nahi
    } catch (e) {
      console.error("Barcode render error:", e);
      return null;
    }
  };

  const exportToCSV = () => {
    if (products.length === 0) {
      notify("warning", "No products to export");
      return;
    }
    let csvContent =
      "Products Inventory Report\n\nID,Name,SKU,Barcode,Category,Location,Supplier,Stock,Cost Price,Sale Price,Min Stock Alert,Inventory Value,Reorder Status\n";
    products.forEach((p, i) => {
      const minAlert = p.minStockAlert ?? 10;
      const stock = p.stock ?? 0;
      const val = stock * (p.costPrice ?? 0);
      csvContent += `${i + 1},"${p.name || ""}",${p.sku || ""},${p.barcode || ""},"${getCategoryName(p.category)}","${getLocationName(p.location)}","${p.supplier || ""}",${stock},RS${(p.costPrice ?? 0).toFixed(2)},RS${(p.salePrice ?? 0).toFixed(2)},${minAlert},RS${val.toFixed(2)},${stock <= minAlert ? "Yes" : "No"}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `products_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("success", "Exported successfully!");
  };

  // ✅ FIXED — No CDN, canvas se image banao, print window mein inject karo
  const printSingleBarcode = (product) => {
    if (!product.barcode) {
      notify("warning", "No barcode on this product");
      return;
    }

    const imgData = makeBarcodeImage(product.barcode);
    if (!imgData) {
      notify("error", "Barcode image generate nahi hua");
      return;
    }

    const pw = window.open("", "_blank");
    if (!pw) {
      notify("warning", "Allow popups for printing");
      return;
    }

    pw.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Barcode - ${product.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #fff;
    }
    .box {
      text-align: center;
      border: 1.5px solid #222;
      padding: 20px 28px;
      border-radius: 8px;
      display: inline-block;
    }
    .name {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #111;
    }
    .info {
      font-size: 11px;
      color: #555;
      margin-bottom: 10px;
    }
    img { display: block; margin: 0 auto; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="box">
    <div class="name">${product.name}</div>
    <div class="info">SKU: ${product.sku || "N/A"} &nbsp;|&nbsp; RS ${product.salePrice || 0}</div>
    <img src="${imgData}" alt="barcode" />
  </div>
  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`);
    pw.document.close();
  };

  // ✅ FIXED — Sab products ke barcodes canvas se render karo, phir print karo
  const printAllBarcodes = () => {
    const list = products.filter(
      (p) => p.barcode && p.barcode.trim().length > 0,
    );
    if (!list.length) {
      notify("warning", "No barcodes found");
      return;
    }

    const pw = window.open("", "_blank");
    if (!pw) {
      notify("warning", "Allow popups for printing");
      return;
    }

    // ✅ Sab images pehle generate karo
    const itemsHtml = list
      .map((p) => {
        const imgData = makeBarcodeImage(p.barcode);
        return `
        <div class="item">
          <div class="name">${p.name}</div>
          <div class="detail">SKU: ${p.sku || "N/A"} | RS ${p.salePrice || 0}</div>
          ${
            imgData
              ? `<img src="${imgData}" alt="barcode" />`
              : `<p style="color:red;font-size:10px;margin-top:8px;">Invalid barcode</p>`
          }
        </div>`;
      })
      .join("");

    pw.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>All Barcodes</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 20px; background: #fff; }
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 14px;
      border-bottom: 2px solid #000;
    }
    .header h1 { font-size: 18px; margin-bottom: 3px; }
    .header p { font-size: 11px; color: #555; }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    .item {
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 6px;
      text-align: center;
      page-break-inside: avoid;
    }
    .name { font-size: 11px; font-weight: bold; margin-bottom: 3px; }
    .detail { font-size: 9px; color: #666; margin-bottom: 6px; }
    img { display: block; margin: 0 auto; max-width: 100%; }
    @media print {
      body { padding: 10px; }
      .grid { grid-template-columns: repeat(3, 1fr); }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Product Barcodes</h1>
    <p>${list.length} products &nbsp;|&nbsp; ${new Date().toLocaleDateString()}</p>
  </div>
  <div class="grid">
    ${itemsHtml}
  </div>
  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`);
    pw.document.close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const barcodeValue = formData.barcode?.trim() || generateBarcode();
      const data = new FormData();
      data.append("name", formData.name?.trim() || "");
      data.append("sku", formData.sku?.trim() || "");
      data.append("barcode", barcodeValue);
      if (formData.categoryId) data.append("category", formData.categoryId);
      data.append("supplier", formData.supplier?.trim() || "");
      if (formData.locationId) data.append("location", formData.locationId);
      data.append("stock", Number(formData.stock) || 0);
      data.append("costPrice", Number(formData.costPrice) || 0);
      data.append("salePrice", Number(formData.salePrice) || 0);
      data.append("minStockAlert", Number(formData.minStockAlert) || 10);
      if (imageFile instanceof File) data.append("image", imageFile);

      if (editingProduct) {
        await api.put(API_ENDPOINTS.PRODUCT_BY_ID(editingProduct._id), data);
        notify("success", "Product updated!");
      } else {
        await api.post(API_ENDPOINTS.PRODUCTS, data);
        notify("success", "Product added!");
      }
      setShowModal(false);
      resetForm();
      await fetchProducts();
    } catch (err) {
      notify("error", err.response?.data?.message || "Failed to save product");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowed.includes(file.type)) {
      notify("error", "Only image files allowed");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify("error", "Max 5MB allowed");
      e.target.value = "";
      return;
    }
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
      notify("success", "Deleted!");
      await fetchProducts();
    } catch (err) {
      notify("error", "Delete failed");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    const categoryId =
      typeof product.category === "object"
        ? product.category?._id
        : product.category;
    const locationId =
      typeof product.location === "object"
        ? product.location?._id
        : product.location;
    const cat = categories.find((c) => c._id === categoryId);
    const loc = locations.find((l) => l._id === locationId);
    setFormData({
      name: product.name || "",
      sku: product.sku || "",
      barcode: product.barcode || "",
      categoryId: categoryId || "",
      categoryName: cat?.name || "",
      supplier: product.supplier || "",
      locationId: locationId || "",
      locationName: loc?.name || "",
      stock: product.stock ?? 0,
      costPrice: product.costPrice ?? 0,
      salePrice: product.salePrice ?? 0,
      minStockAlert: product.minStockAlert ?? 10,
    });
    const imgUrl = getImageUrl(product.image);
    setImagePreview(imgUrl || "");
    setImageFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: "",
      barcode: "",
      categoryId: "",
      categoryName: "",
      supplier: "",
      locationId: "",
      locationName: "",
      stock: 0,
      costPrice: 0,
      salePrice: 0,
      minStockAlert: 10,
    });
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview("");
  };

  const totalPurchaseValue = products.reduce(
    (sum, p) => sum + (p.stock ?? 0) * (p.costPrice ?? 0),
    0,
  );
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + (p.stock ?? 0) * (p.salePrice ?? 0),
    0,
  );
  const totalExpectedProfit = totalInventoryValue - totalPurchaseValue;
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const needReorderCount = products.filter(
    (p) => (p.stock ?? 0) <= (p.minStockAlert ?? 10),
  ).length;

  return (
    <div className="container-fluid">
      {alert.show && (
        <div
          className={`alert alert-${alert.type === "success" ? "success" : alert.type === "warning" ? "warning" : "danger"} position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg border-0 rounded-pill px-5 py-3 fw-bold text-white`}
          style={{
            zIndex: 3000,
            minWidth: "350px",
            animation: "slideDown 0.4s ease-out",
          }}
        >
          <i
            className={`bi ${alert.type === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-2 fs-5`}
          ></i>
          {alert.message}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4 product-head">
        <h2 className="product-heading">Products / Inventory</h2>
        <div className="d-flex gap-2 product-header">
          <button
            className="btn btn-success csv-btn"
            onClick={exportToCSV}
            disabled={!products.length}
            style={{ width: "208px" }}
          >
            <i className="bi bi-download me-2"></i>Export CSV
          </button>
          <button
            className="btn btn-info text-white barcode-btn"
            onClick={printAllBarcodes}
            disabled={!products.filter((p) => p.barcode).length}
          >
            <i className="bi bi-upc-scan me-2"></i>Print All Barcodes
          </button>
          <button
            className="btn add-btn bg-primary text-white"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus-circle me-2 text-white"></i>Add New Product
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4 col-lg-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                  <i className="bi bi-box-seam text-primary fs-5"></i>
                </div>
                <span className="badge bg-primary">Total</span>
              </div>
              <h3 className="mb-1 fw-bold">{products.length}</h3>
              <p className="text-muted small mb-0">Total Products</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="rounded-circle bg-warning bg-opacity-10 p-2">
                  <i className="bi bi-cash-stack text-warning fs-5"></i>
                </div>
                <span className="badge bg-warning text-dark">Purchase</span>
              </div>
              <h3 className="mb-1 fw-bold">
                RS {totalPurchaseValue.toLocaleString()}
              </h3>
              <p className="text-muted small mb-0">Total Purchase Value</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="rounded-circle bg-info bg-opacity-10 p-2">
                  <i className="bi bi-boxes text-info fs-5"></i>
                </div>
                <span className="badge bg-info">Units</span>
              </div>
              <h3 className="mb-1 fw-bold">
                {totalStockUnits.toLocaleString()}
              </h3>
              <p className="text-muted small mb-0">Total Stock Units</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="rounded-circle bg-success bg-opacity-10 p-2">
                  <i className="bi bi-currency-dollar text-success fs-5"></i>
                </div>
                <span className="badge bg-success">Inventory</span>
              </div>
              <h3 className="mb-1 fw-bold">
                RS {totalInventoryValue.toLocaleString()}
              </h3>
              <p className="text-muted small mb-0">Inventory Value</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="rounded-circle bg-success bg-opacity-10 p-2">
                  <i className="bi bi-graph-up-arrow text-success fs-5"></i>
                </div>
                <span className="badge bg-success">Profit</span>
              </div>
              <h3 className="mb-1 fw-bold">
                RS {totalExpectedProfit.toLocaleString()}
              </h3>
              <p className="text-muted small mb-0">Expected Profit</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="rounded-circle bg-danger bg-opacity-10 p-2">
                  <i className="bi bi-exclamation-triangle text-danger fs-5"></i>
                </div>
                <span className="badge bg-danger">Alert</span>
              </div>
              <h3 className="mb-1 fw-bold">{needReorderCount}</h3>
              <p className="text-muted small mb-0">Need Reorder</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body py-3">
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-lg ps-5 rounded-pill"
              placeholder="Search by name, SKU, barcode or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-sm table-bordered table-hover mb-0 align-middle">
              <thead className="bg-light text-muted small text-uppercase">
                <tr>
                  <th className="px-2 py-1">ID</th>
                  <th className="px-2 py-1">Product</th>
                  <th className="px-2 py-1">Name</th>
                  <th className="px-2 py-1 text-center">Price</th>
                  <th className="px-2 py-1 text-center">Location</th>
                  <th className="px-2 py-1 text-center">Stock</th>
                  <th className="px-2 py-1 text-center">Value</th>
                  <th className="px-2 py-1 text-center">Reorder</th>
                  <th className="px-2 py-1 text-center">Level</th>
                  <th className="px-2 py-1 text-center">Category</th>
                  <th className="px-2 py-1 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary" />
                    </td>
                  </tr>
                ) : currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5 text-muted">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product, index) => {
                    const globalIndex = indexOfFirst + index + 1;
                    const minAlert = product.minStockAlert ?? 10;
                    const stock = product.stock ?? 0;
                    const needsReorder = stock <= minAlert;
                    const inventoryValue = stock * (product.costPrice ?? 0);
                    const categoryName = getCategoryName(product.category);
                    const locationName = getLocationName(product.location);
                    const imageUrl = getImageUrl(product.image);

                    return (
                      <tr key={product._id}>
                        <td className="px-2 py-1 text-muted">#{globalIndex}</td>
                        <td className="px-2 py-1">
                          <div className="d-flex align-items-center gap-2">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name || "product"}
                                className="rounded border"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div
                                className="bg-light border rounded d-flex align-items-center justify-content-center"
                                style={{ width: "30px", height: "30px" }}
                              >
                                <i
                                  className="bi bi-image text-muted"
                                  style={{ fontSize: "12px" }}
                                ></i>
                              </div>
                            )}
                            <div className="lh-sm">
                              <div className="fw-medium">
                                {product.name || "N/A"}
                              </div>
                              <small className="text-muted">
                                SKU: {product.sku || "—"}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-1">{product.name || "N/A"}</td>
                        <td className="px-2 py-1 text-center">
                          RS {product.salePrice?.toLocaleString() || "—"}
                        </td>
                        <td className="px-2 py-1 text-center">
                          <span className="badge bg-warning text-dark px-2 py-0">
                            {locationName}
                          </span>
                        </td>
                        <td
                          className="px-2 py-1 text-center fw-semibold"
                          style={{
                            color: needsReorder ? "#dc3545" : "inherit",
                          }}
                        >
                          {stock}
                        </td>
                        <td className="px-2 py-1 text-center">
                          RS {inventoryValue.toFixed(0)}
                        </td>
                        <td className="px-2 py-1 text-center">
                          <span
                            className={`badge ${needsReorder ? "bg-danger" : "bg-success"} px-2 py-0`}
                          >
                            {needsReorder ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-2 py-1 text-center">{minAlert}</td>
                        <td className="px-2 py-1 text-center">
                          {categoryName}
                        </td>
                        <td className="px-2 py-1 text-end">
                          {product.barcode && (
                            <button
                              className="btn btn-xs btn-outline-info me-1"
                              onClick={() => printSingleBarcode(product)}
                              title="Print Barcode"
                            >
                              <i className="bi bi-upc-scan"></i>
                            </button>
                          )}
                          <button
                            className="btn btn-xs btn-outline-primary me-1"
                            onClick={() => openEditModal(product)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-xs btn-outline-danger"
                            onClick={() => handleDelete(product._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="card-footer bg-light">
              <div className="d-flex justify-content-between align-items-center py-2">
                <div className="text-muted small">
                  Showing {indexOfFirst + 1}–
                  {Math.min(indexOfLast, filteredProducts.length)} of{" "}
                  {filteredProducts.length}
                </div>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                      >
                        Prev
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">SKU</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Barcode</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Auto generate if empty"
                        value={formData.barcode}
                        onChange={(e) =>
                          setFormData({ ...formData, barcode: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mt-2 w-100"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            barcode: generateBarcode(),
                          })
                        }
                      >
                        Generate
                      </button>
                    </div>

                    {formData.barcode?.length === 13 && (
                      <div className="col-12 text-center mt-3">
                        <Barcode
                          value={formData.barcode}
                          width={2}
                          height={100}
                          fontSize={16}
                        />
                      </div>
                    )}

                    <div className="col-md-4">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={formData.categoryId}
                        onChange={(e) => {
                          const id = e.target.value;
                          const cat = categories.find((c) => c._id === id);
                          setFormData({
                            ...formData,
                            categoryId: id,
                            categoryName: cat?.name || "",
                          });
                        }}
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Supplier</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.supplier}
                        onChange={(e) =>
                          setFormData({ ...formData, supplier: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Location</label>
                      <select
                        className="form-select"
                        value={formData.locationId}
                        onChange={(e) => {
                          const id = e.target.value;
                          const loc = locations.find((l) => l._id === id);
                          setFormData({
                            ...formData,
                            locationId: id,
                            locationName: loc?.name || "",
                          });
                        }}
                      >
                        <option value="">All Locations</option>
                        {locations.map((loc) => (
                          <option key={loc._id} value={loc._id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Current Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Cost Price</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        required
                        value={formData.costPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            costPrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Sale Price</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        required
                        value={formData.salePrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salePrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Low Stock Alert</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.minStockAlert}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minStockAlert: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Product Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                      />
                      <small className="text-muted">
                        Max 5MB | JPG, PNG, GIF, WEBP
                      </small>
                      {imagePreview && (
                        <div className="mt-3 text-center">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid rounded border"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? "Update" : "Add"} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
