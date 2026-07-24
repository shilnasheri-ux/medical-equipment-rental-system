import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getAllBookings,
  approveBooking,
  rejectBooking,
} from "../services/bookingAdminService";
import { completeReturn } from "../services/bookingService";

const STATUS_BADGE_CLASS = {
  pending: "bg-warning text-dark",
  confirmed: "bg-success",
  active: "bg-primary",
  returned: "bg-secondary",
  cancelled: "bg-danger",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const formatPrice = (value) => {
  if (value === null || value === undefined) return "-";
  const num = Number(value);
  return Number.isNaN(num) ? value : `$${num.toFixed(2)}`;
};

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // Tracks which booking id currently has an approve/reject/return request in
  // flight, so we can disable just that row's buttons instead of the whole table.
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleStatusUpdate = async (bookingId, action) => {
    setActionLoadingId(bookingId);
    setError("");
    setSuccessMessage("");
    try {
      const newStatus = action === "approve" ? "confirmed" : "cancelled";

      if (action === "approve") {
        await approveBooking(bookingId);
      } else {
        await rejectBooking(bookingId);
      }

      // Update the booking in the table immediately, without a full
      // page reload/spinner, so only the clicked row reflects the change.
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      setSuccessMessage(
        action === "approve"
          ? `Booking #${bookingId} approved successfully.`
          : `Booking #${bookingId} rejected.`
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          `Failed to ${action} booking #${bookingId}. Please try again.`
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteReturn = async (bookingId) => {
    setActionLoadingId(bookingId);
    setError("");
    setSuccessMessage("");
    try {
      await completeReturn(bookingId);

      // Update the booking in the table immediately, without waiting on
      // a full re-fetch, so the UI reflects the change right away.
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "returned", return_requested: false }
            : booking
        )
      );

      setSuccessMessage(`Booking #${bookingId} has been marked as returned.`);
    } catch (err) {
      setError(
        err?.message ||
          `Failed to complete return for booking #${bookingId}. Please try again.`
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Booking Management</h2>
          <Link to="/admin-dashboard" className="text-decoration-none" style={{ fontSize: "0.875rem" }}>
            ← Back to Dashboard
          </Link>
        </div>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={fetchBookings}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="alert alert-info">No bookings found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Booking ID</th>
                <th>User Name</th>
                <th>Equipment Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const isPending = booking.status === "pending";
                const isActionLoading = actionLoadingId === booking.id;
                const badgeClass =
                  STATUS_BADGE_CLASS[booking.status] || "bg-secondary";

                return (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>
                      {booking.user_name ||
                        booking.user?.username ||
                        booking.user ||
                        "-"}
                    </td>
                    <td>
                      {booking.equipment_name ||
                        booking.equipment?.name ||
                        booking.equipment ||
                        "-"}
                    </td>
                    <td>{formatDate(booking.start_date)}</td>
                    <td>{formatDate(booking.end_date)}</td>
                    <td>{formatPrice(booking.total_price)}</td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <span className={`badge ${badgeClass}`}>
                          {booking.status}
                        </span>
                        {booking.return_requested && (
                          <span className="badge bg-warning text-dark">
                            Return Requested
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {isPending ? (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm d-inline-flex align-items-center gap-2"
                            disabled={isActionLoading}
                            onClick={() =>
                              handleStatusUpdate(booking.id, "approve")
                            }
                          >
                            {isActionLoading && (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              />
                            )}
                            {isActionLoading ? "..." : "Approve"}
                          </button>
                          <button
                            className="btn btn-danger btn-sm d-inline-flex align-items-center gap-2"
                            disabled={isActionLoading}
                            onClick={() =>
                              handleStatusUpdate(booking.id, "reject")
                            }
                          >
                            {isActionLoading && (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              />
                            )}
                            {isActionLoading ? "..." : "Reject"}
                          </button>
                        </div>
                      ) : booking.return_requested ? (
                        <button
                          className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
                          disabled={isActionLoading}
                          onClick={() => handleCompleteReturn(booking.id)}
                        >
                          {isActionLoading && (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            />
                          )}
                          {isActionLoading ? "Completing..." : "Complete Return"}
                        </button>
                      ) : (
                        <span className="text-muted">No actions</span>
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

export default AdminBookingsPage;