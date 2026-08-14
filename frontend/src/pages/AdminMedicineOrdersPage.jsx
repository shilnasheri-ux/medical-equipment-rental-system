import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getAllMedicineOrdersAdmin,
  updateMedicineOrderStatus,
} from "../services/medicineService";

const STATUS_BADGE_CLASSES = {
  pending: "bg-warning text-dark",
  confirmed: "bg-info text-dark",
  preparing: "bg-secondary",
  out_for_delivery: "bg-primary",
  delivered: "bg-success",
  cancelled: "bg-danger",
};

// Maps the current status to the single "next step" action available in
// this fulfillment/tracking flow (not an approval system).
const NEXT_ACTION_MAP = {
  pending: { label: "Confirm Order", nextStatus: "confirmed" },
  confirmed: { label: "Start Preparing", nextStatus: "preparing" },
  preparing: { label: "Out for Delivery", nextStatus: "out_for_delivery" },
  out_for_delivery: { label: "Mark as Delivered", nextStatus: "delivered" },
  delivered: null,
  cancelled: null,
};

// Cancellation is only available before the order reaches out_for_delivery.
const CANCELLABLE_STATUSES = ["pending", "confirmed", "preparing"];

function getNextAction(status) {
  return NEXT_ACTION_MAP[status] || null;
}

function StatusBadge({ status, statusDisplay }) {
  const badgeClass = STATUS_BADGE_CLASSES[status] || "bg-secondary";
  return (
    <span className={`badge ${badgeClass}`}>
      {statusDisplay || status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading</span>
        </div>
        <p className="text-muted mb-0">Loading medicine orders...</p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="container mt-4 mb-5">
      <div className="alert alert-danger" role="alert">
        <p className="fw-semibold mb-2">Failed to load medicine orders</p>
        <p className="mb-3">{message}</p>
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
}

const AdminMedicineOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllMedicineOrdersAdmin();
      setOrders(response.data.orders || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to load medicine orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await updateMedicineOrderStatus(orderId, newStatus);
      toast.success(response.data.message || "Order status updated successfully.");
      await fetchOrders();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchOrders} />;
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Medicine Orders Management</h2>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={fetchOrders}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No medicine orders found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Phone Number</th>
                <th>Delivery Address</th>
                <th>Status</th>
                <th>Ordered Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isUpdating = updatingId === order.id;
                const nextAction = getNextAction(order.status);
                const canCancel = CANCELLABLE_STATUSES.includes(order.status);

                return (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user}</td>
                    <td>{order.medicine_name}</td>
                    <td>{order.quantity}</td>
                    <td>₹{Number(order.total_price).toFixed(2)}</td>
                    <td>{order.phone_number}</td>
                    <td>{order.delivery_address}</td>
                    <td>
                      <StatusBadge
                        status={order.status}
                        statusDisplay={order.status_display}
                      />
                    </td>
                    <td>
                      {new Date(order.ordered_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {nextAction || canCancel ? (
                        <div className="d-flex flex-wrap gap-2">
                          {nextAction && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                handleStatusChange(order.id, nextAction.nextStatus)
                              }
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Updating..." : nextAction.label}
                            </button>
                          )}
                          {canCancel && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleStatusChange(order.id, "cancelled")}
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Updating..." : "Cancel Order"}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMedicineOrdersPage;