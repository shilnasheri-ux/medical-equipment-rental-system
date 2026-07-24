import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/bookingAdminService";

function StockSummaryCards({ stats, loading }) {
  const cards = [
    { label: "Total Stock", value: stats?.total_stock, colorClass: "text-primary" },
    { label: "Reserved Stock", value: stats?.reserved, colorClass: "text-warning" },
    { label: "Active Stock", value: stats?.active, colorClass: "text-info" },
    { label: "Available Stock", value: stats?.available, colorClass: "text-success" },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => (
        <div className="col-6 col-md-3" key={card.label}>
          <div className="card shadow-sm h-100">
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
    },
    {
      title: "Medicine Management",
      buttonLabel: "Manage Medicines",
      to: "/admin/medicines",
    },
    {
      title: "Booking Management",
      buttonLabel: "Manage Bookings",
      to: "/admin/bookings",
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => (
        <div className="col-12 col-md-4" key={card.title}>
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{card.title}</h5>
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