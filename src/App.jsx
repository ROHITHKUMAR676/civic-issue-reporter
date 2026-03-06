import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleSuccess from "./pages/GoogleSuccess";
import UserDashboard from "./pages/UserDashboard";
import ReportIssue from "./pages/ReportIssue";
import NearbyIssues from "./pages/NearbyIssues";
import Account from "./pages/Account";
import Inbox from "./pages/Inbox";
import AdminVerification from "./pages/AdminVerification";
import VerifyOtp from "./pages/VerifyOtp";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminIssues from "./pages/AdminIssues";
import DeptLayout from "./layouts/DeptLayout";

// pages
import DeptDashboard from "./pages/DeptDashboard";
import DeptIssues from "./pages/DeptIssues";

function App() {
  return (
    <Router>
      <Routes>
<Route path="/google-success" element={<GoogleSuccess />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nearby"
          element={
            <ProtectedRoute>
              <NearbyIssues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />

        {/* ⭐⭐⭐ ADMIN — CORRECT NESTED ROUTING */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* DEFAULT ADMIN PAGE */}
          <Route index element={<AdminDashboard />} />

          {/* SUB PAGES */}
          <Route path="issues" element={<AdminIssues />} />
          <Route path="verification" element={<AdminVerification />} />

        </Route>
<Route
  path="/dept"
  element={
    <ProtectedRoute role="dept">
      <DeptLayout />
    </ProtectedRoute>
  }
>
  {/* DEFAULT PAGE */}
  <Route index element={<DeptDashboard />} />

  {/* SUB ROUTES */}
  <Route path="dashboard" element={<DeptDashboard />} />
  <Route path="issues" element={<DeptIssues />} />
  

</Route>

      </Routes>
    </Router>
  );
}

export default App;
