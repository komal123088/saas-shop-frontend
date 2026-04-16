import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// ── Shop Pages () ──
import Dashboard from "./pages/Dashboard";
import Products from "./pages/products/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import SalesPOS from "./pages/SalesPOS.jsx";
import CashCustomers from "./pages/customers/CashCustomers.jsx";
import PermanentCredit from "./pages/customers/PermanentCredit.jsx";
import TemporaryCredit from "./pages/customers/TemporaryCredit.jsx";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import Layout from "./components/layout.jsx";
import Setting from "./pages/Settings.jsx";
import SalesHistoryPage from "./pages/SalesHistory.jsx";
import Categories from "./pages/products/Categories.jsx";
import Locations from "./pages/products/Locations.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import Expenses from "./pages/Expenses.jsx";

// ── Shop Auth Pages ──
import OwnerLogin from "./pages/auth/OwnerLogin";
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import OwnerRegister from "./pages/auth/OwnerRegister";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

// ── SaaS  Pages ──
import LandingPage from "./pages/LandingPage.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import TenantsPage from "./pages/admin/TenantsPage.jsx";
import TenantDetailPage from "./pages/admin/TenantDetailPage.jsx";
import AddTenantPage from "./pages/admin/AddTenantPage.jsx";
import PlansPage from "./pages/admin/PlansPage.jsx";
import PendingRegistrationsPage from "./pages/admin/PendingRegistrationsPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AuthProvider>
          <Routes>
            {/* ══ PUBLIC: Landing Page ══ */}
            <Route path="/" element={<LandingPage />} />

            {/* ══ SHOP AUTH (existing) ══ */}
            <Route path="/login" element={<OwnerLogin />} />
            <Route path="/owner-login" element={<OwnerLogin />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/owner-register" element={<OwnerRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* ══ SHOP PROTECTED ROUTES (existing — /shop/* pe move kiya) ══ */}
            <Route
              path="/shop/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="inventory"
                element={
                  <ProtectedRoute allowedRoles={["manager", "stock_keeper"]}>
                    <InventoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products"
                element={
                  <ProtectedRoute allowedRoles={["manager", "stock_keeper"]}>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products/:id"
                element={
                  <ProtectedRoute allowedRoles={["manager", "stock_keeper"]}>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="locations"
                element={
                  <ProtectedRoute allowedRoles={["manager", "stock_keeper"]}>
                    <Locations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="categories"
                element={
                  <ProtectedRoute allowedRoles={["manager", "stock_keeper"]}>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="sales/pos"
                element={
                  <ProtectedRoute allowedRoles={["manager", "cashier"]}>
                    <SalesPOS />
                  </ProtectedRoute>
                }
              />
              <Route
                path="sales/history"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <SalesHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customers/cash"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <CashCustomers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customers/permanent-credit"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <PermanentCredit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customers/temporary-credit"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <TemporaryCredit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="employees"
                element={
                  <ProtectedRoute allowedRoles={[]}>
                    <Employees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="expenses"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <Expenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="setting"
                element={
                  <ProtectedRoute allowedRoles={[]}>
                    <Setting />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ══ SUPER ADMIN (hidden) ══ */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="tenants" element={<TenantsPage />} />
              <Route path="tenants/add" element={<AddTenantPage />} />
              <Route path="tenants/:id" element={<TenantDetailPage />} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="pending" element={<PendingRegistrationsPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
