import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ❌ No token → back to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role mismatch → block access
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}

export default ProtectedRoute;
