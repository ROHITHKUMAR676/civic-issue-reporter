import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../pages/Register";
import NearbyIssues from "../pages/NearbyIssues";
import ReportIssue from "../pages/ReportIssue";
import Account from "./pages/Account";
import Inbox from "./pages/Inbox";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/nearby" element={<NearbyIssues />} />
      <Route path="/account" element={<Account />} />
      <Route path="/inbox" element={<Inbox />} />

        {/* PRIVATE */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
