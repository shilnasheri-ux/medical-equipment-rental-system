import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/bookingAdminService";

const dashboardStyles = `
  .admin-management-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .admin-management-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.1);
  }
  .admin-management-icon {
    font-size: 1.75rem;
    line-height: 1;
  }
`;

function StockSummaryCards({ stats, loading }) {
  const cards = [
    {
      label: "Total Stock",
      value: stats?.total_stock,
      colorClass: "text-primary",
      bgClass: "bg-primary-subtle",
    },
    {
      label: "Reserved Stock",
      value: stats?.reserved,
      colorClass: "text-warning",
      bgClass: "bg-warning-subtle",
    },
    {
      label: "Active Stock",
      value: stats?.active,
      colorClass: "text-info",
      bgClass: "bg-info-subtle",
    },
    {
      label: "Available Stock",
      value: stats?.available,
      colorClass: "text-success",
      bgClass: "bg-success-subtle",
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => (
        <div className="col-6 col-md-3" key={card.label}>
          <div className={`card shadow-sm h-100 border-0 ${card.bgClass}`}>
            <div className="card-body text-center">
              <h6 className="card-subtitle mb-2 text-muted">{card.label}</h6>
              <p className={`card-text fs-3 fw-bold mb-0 ${card.colorClass}`}>
                {loading ? "…" : card.value ?? "-"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ManagementCards() {
  const cards = [
    {
      title: "Equipment Management",
      buttonLabel: "Manage Equipment",
      to: "/admin/equipment",
      icon: "bi-box-seam",
    },
    {
      title: "Medicine Management",
      buttonLabel: "Manage Medicines",
      to: "/admin/medicines",
      icon: "bi-capsule-pill",
    },
    {
      title: "Booking Management",
      buttonLabel: "Manage Bookings",
      to: "/admin/bookings",
      icon: "bi-calendar-check",
    },
    {
      title: "Medicine Orders",
      buttonLabel: "Manage Medicine Orders",
      to: "/admin/medicine-orders",
      icon: "bi-receipt",
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => (
        <div className="col-12 col-md-6" key={card.title}>
          <div className="card shadow-sm h-100 admin-management-card">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center gap-3 mb-3">
                <i className={`bi ${card.icon} admin-management-icon text-primary`}></i>
                <h5 className="card-title mb-0">{card.title}</h5>
              </div>
              <Link
                to={card.to}
                className="btn btn-primary btn-sm mt-auto align-self-start"
              >
                {card.buttonLabel}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const AdminDashboard = () => {
  const [stockStats, setStockStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStockStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await getDashboardStats();
      setStockStats(response.data?.stock || null);
    } catch (err) {
      setStockStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockStats();
  }, [fetchStockStats]);

  return (
    <div className="container mt-4 mb-5">
      <style>{dashboardStyles}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Admin Dashboard</h2>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={fetchStockStats}
          disabled={statsLoading}
        >
          {statsLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <StockSummaryCards stats={stockStats} loading={statsLoading} />

      <ManagementCards />
    </div>
  );
};

export default AdminDashboard;