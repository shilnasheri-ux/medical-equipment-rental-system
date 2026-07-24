import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const {
      isLoggedIn,
      isStaff,
      loading,
  } = useAuth();


  if (loading) {
      return (
          <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "60vh" }}
          >
              <div
                  className="spinner-border"
                  role="status"
                  style={{ color: "#0f6fd8" }}
              >
                  <span className="visually-hidden">
                      Loading
                  </span>
              </div>
          </div>
      );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isStaff) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;