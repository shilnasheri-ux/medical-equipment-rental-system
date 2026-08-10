// pages/MyBookingsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getMyBookings,
  markNotificationRead,
} from "../services/bookingService";
import { getMyMedicineOrders } from "../services/medicineService";
import { toast } from "react-toastify";

const STATUS_STYLES = {
  pending: { bg: '#fef9c3', color: '#854d0e' },
  confirmed: { bg: '#dbeafe', color: '#1e40af' },
  active: { bg: '#dcfce7', color: '#166534' },
  returned: { bg: '#f1f5f9', color: '#475569' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.returned;
  return (
    <span
      className="badge rounded-pill px-3 py-1"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.3px',
      }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Shown in place of the "Pay Now" button once a booking's payment_status
// is 'paid'. Matches the existing badge visual language on this page.
function PaidBadge() {
  return (
    <span
      className="badge rounded-pill px-3 py-1 mt-2"
      style={{
        backgroundColor: '#dcfce7',
        color: '#166534',
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.3px',
      }}
    >
      ✓ Paid
    </span>
  );
}

function PayNowButton({ bookingId }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/payment/${bookingId}`)}
      className="btn btn-sm rounded-3 fw-semibold mt-2"
      style={{
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        fontSize: '0.78rem',
        padding: '5px 14px',
      }}
    >
      Pay Now
    </button>
  );
}

function TrackOrderButton({ bookingId }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/order-tracking/${bookingId}`)}
      className="btn btn-sm btn-outline-primary rounded-3 fw-semibold mt-2 ms-2"
      style={{
        fontSize: '0.78rem',
        padding: '5px 14px',
      }}
    >
      Track Order
    </button>
  );
}

function BookingCard({ booking }) {
  // Payment button only for confirmed + not-yet-paid bookings.
  const showPayNow = booking.status === 'confirmed' && booking.payment_status === 'pending';
  const showPaidBadge = booking.payment_status === 'paid';
  // Order tracking only becomes available once payment has gone through.
  const showTrackOrder = booking.status === 'active' || booking.status === 'returned';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f2',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 12px rgba(15,111,216,0.06)',
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h6
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              color: '#1a2035',
              marginBottom: '0.2rem',
            }}
          >
            {booking.equipment_name}
          </h6>
          <span style={{ fontSize: '0.78rem', color: '#6b7a99' }}>
            Booking #{booking.id}
          </span>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {booking.notification && (
        <p
          style={{
            color: booking.status === "confirmed" ? "green" : "red",
            fontSize: "14px",
            marginTop: "8px",
            marginBottom: "12px",
            fontWeight: "600",
          }}
        >
          {booking.notification}
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem 1rem',
        }}
      >
        {[
          { label: 'Start Date', value: booking.start_date },
          { label: 'End Date', value: booking.end_date },
          {
            label: 'Total Price',
            value: booking.total_price
              ? `₹${Number(booking.total_price).toFixed(2)}`
              : '—',
            highlight: true,
          },
          {
            label: 'Booked On',
            value: new Date(booking.created_at).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            }),
          },
        ].map(({ label, value, highlight }) => (
          <div key={label}>
            <div
              style={{
                fontSize: '0.7rem',
                color: '#6b7a99',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                marginBottom: '0.15rem',
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: highlight ? 700 : 500,
                color: highlight ? '#0f6fd8' : '#1a2035',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center flex-wrap">
        {showPayNow && <PayNowButton bookingId={booking.id} />}
        {showPaidBadge && <PaidBadge />}
        {showTrackOrder && <TrackOrderButton bookingId={booking.id} />}
      </div>
    </div>
  );
}

// ── Medicine Orders — added below, styled identically to the Equipment
// Bookings section above (same badge language, same table/card patterns).
const MEDICINE_STATUS_STYLES = {
  pending: { bg: '#fef9c3', color: '#854d0e' },
  confirmed: { bg: '#dbeafe', color: '#1e40af' },
  preparing: { bg: '#fef3c7', color: '#92400e' },
  out_for_delivery: { bg: '#e0e7ff', color: '#3730a3' },
  delivered: { bg: '#dcfce7', color: '#166534' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

function MedicineStatusBadge({ status, label }) {
  const style = MEDICINE_STATUS_STYLES[status] || MEDICINE_STATUS_STYLES.pending;
  return (
    <span
      className="badge rounded-pill px-3 py-1"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.3px',
      }}
    >
      {label || (status.charAt(0).toUpperCase() + status.slice(1))}
    </span>
  );
}

// Every medicine order shown here was, by construction, only created
// after a successful payment (see PaymentPage pharmacy mode) — the
// MedicineOrder model has no payment_status field of its own, so this
// is always "Paid" for any order the user can see.
function MedicinePaidBadge() {
  return (
    <span
      className="badge rounded-pill px-3 py-1"
      style={{
        backgroundColor: '#dcfce7',
        color: '#166534',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.3px',
      }}
    >
      ✓ Paid
    </span>
  );
}

function TrackMedicineOrderButton({ orderId }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/medicine-order-tracking/${orderId}`)}
      className="btn btn-sm btn-outline-primary rounded-3 fw-semibold mt-2"
      style={{
        fontSize: '0.78rem',
        padding: '5px 14px',
      }}
    >
      Track Order
    </button>
  );
}

function MedicineOrderCard({ order }) {
  const showTrackOrder = order.status !== 'pending' && order.status !== 'cancelled';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f2',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 12px rgba(15,111,216,0.06)',
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h6
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              color: '#1a2035',
              marginBottom: '0.2rem',
            }}
          >
            {order.medicine_name}
          </h6>
          <span style={{ fontSize: '0.78rem', color: '#6b7a99' }}>
            Order #{order.id}
          </span>
        </div>
        <MedicineStatusBadge status={order.status} label={order.status_display} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem 1rem',
        }}
      >
        {[
          { label: 'Quantity', value: order.quantity },
          {
            label: 'Total Amount',
            value: order.total_price
              ? `₹${Number(order.total_price).toFixed(2)}`
              : '—',
            highlight: true,
          },
          {
            label: 'Ordered On',
            value: new Date(order.ordered_at).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            }),
          },
        ].map(({ label, value, highlight }) => (
          <div key={label}>
            <div
              style={{
                fontSize: '0.7rem',
                color: '#6b7a99',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                marginBottom: '0.15rem',
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: highlight ? 700 : 500,
                color: highlight ? '#0f6fd8' : '#1a2035',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center flex-wrap">
        <MedicinePaidBadge />
        {showTrackOrder && <TrackMedicineOrderButton orderId={order.id} />}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '320px', gap: '1rem' }}
    >
      <div
        className="spinner-border"
        role="status"
        style={{ color: '#0f6fd8', width: '2.25rem', height: '2.25rem' }}
      >
        <span className="visually-hidden">Loading</span>
      </div>
      <p style={{ color: '#6b7a99', fontSize: '0.9rem', margin: 0 }}>
        Loading your bookings…
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div
      className="d-flex align-items-start gap-3 p-4 rounded-3"
      style={{
        backgroundColor: '#fff5f5',
        border: '1px solid #fecaca',
      }}
    >
      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⚠️</span>
      <div>
        <p
          style={{
            color: '#991b1b',
            fontWeight: 600,
            marginBottom: '0.25rem',
            fontSize: '0.95rem',
          }}
        >
          Failed to load bookings
        </p>
        <p
          style={{
            color: '#b91c1c',
            fontSize: '0.85rem',
            marginBottom: '0.75rem',
          }}
        >
          {message}
        </p>
        <button
          onClick={onRetry}
          className="btn btn-sm rounded-2 fw-semibold"
          style={{
            backgroundColor: '#dc2626',
            color: '#fff',
            border: 'none',
            fontSize: '0.8rem',
            padding: '5px 16px',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center py-5 rounded-3"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f2',
        boxShadow: '0 4px 24px rgba(15,111,216,0.06)',
        minHeight: '320px',
        padding: '3rem 2rem',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          backgroundColor: '#eaf2ff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            stroke="#0f6fd8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h5
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          color: '#1a2035',
          marginBottom: '0.5rem',
          fontSize: '1.1rem',
        }}
      >
        You have no bookings yet.
      </h5>
      <p
        style={{
          color: '#6b7a99',
          fontSize: '0.875rem',
          marginBottom: '1.75rem',
          maxWidth: '300px',
        }}
      >
        Browse our catalogue and book your first piece of medical equipment.
      </p>
      <Link
        to="/equipment"
        className="btn rounded-3 px-4 py-2 fw-semibold"
        style={{
          backgroundColor: '#0f6fd8',
          color: '#fff',
          border: 'none',
          fontSize: '0.9rem',
        }}
      >
        Browse Equipment
      </Link>
    </div>
  );
}

function MedicineOrdersEmptyState() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center py-5 rounded-3"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f2',
        boxShadow: '0 4px 24px rgba(15,111,216,0.06)',
        minHeight: '220px',
        padding: '2.5rem 2rem',
      }}
    >
      <h5
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          color: '#1a2035',
          marginBottom: '0.5rem',
          fontSize: '1.05rem',
        }}
      >
        You have no medicine orders yet.
      </h5>
      <p
        style={{
          color: '#6b7a99',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
          maxWidth: '320px',
        }}
      >
        Browse the pharmacy to order medicines.
      </p>
      <Link
        to="/pharmacy"
        className="btn rounded-3 px-4 py-2 fw-semibold"
        style={{
          backgroundColor: '#0f6fd8',
          color: '#fff',
          border: 'none',
          fontSize: '0.9rem',
        }}
      >
        Browse Pharmacy
      </Link>
    </div>
  );
}

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [medicineOrders, setMedicineOrders] = useState([]);
  const [medOrdersLoading, setMedOrdersLoading] = useState(true);
  const [medOrdersError, setMedOrdersError] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyBookings();
      console.log("API Response:", data);
      console.log("Bookings:", data.bookings);
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicineOrders = async () => {
    try {
      setMedOrdersLoading(true);
      setMedOrdersError('');
      const data = await getMyMedicineOrders();
      setMedicineOrders(data.orders || []);
    } catch (err) {
      setMedOrdersError(err.message);
    } finally {
      setMedOrdersLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);
  useEffect(() => { fetchMedicineOrders(); }, []);
  useEffect(() => {
  if (bookings.length === 0) return;

bookings.forEach((booking) => {
  if (booking.notification) {
    toast(booking.notification, {
      toastId: booking.id,
      type:
        booking.status === "confirmed"
          ? "success"
          : booking.status === "cancelled"
          ? "error"
          : "info",
      autoClose: 5000,
      onClose: async () => {
        try {
          await markNotificationRead(booking.id);
        } catch (err) {
          console.log(err);
        }
      },
    });
  }
});
}, [bookings]);

  const pageStyle = {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f4f7fc',
    padding: '2.5rem 1rem 4rem',
  };

  const titleStyle = {
    fontFamily: "'Sora', sans-serif",
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#1a2035',
    marginBottom: 0,
  };

  const sectionTitleStyle = {
    fontFamily: "'Sora', sans-serif",
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#1a2035',
    marginBottom: 0,
  };

  const tableWrapStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f2',
    borderRadius: '14px',
    boxShadow: '0 4px 24px rgba(15,111,216,0.07)',
    overflow: 'hidden',
  };

  const thStyle = {
    backgroundColor: '#f8faff',
    color: '#6b7a99',
    fontWeight: 600,
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '0.9rem 1.25rem',
    borderBottom: '1px solid #e2e8f2',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '1rem 1.25rem',
    fontSize: '0.875rem',
    color: '#1a2035',
    fontWeight: 500,
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle',
  };

  return (
    <div style={pageStyle}>
      <div className="container" style={{ maxWidth: '940px' }}>

        {/* Page header */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <div>
            <h1 style={titleStyle}>My Bookings</h1>
            {!loading && !error && bookings.length > 0 && (
              <p
                style={{
                  color: '#6b7a99',
                  fontSize: '0.85rem',
                  marginTop: '0.3rem',
                  marginBottom: 0,
                }}
              >
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <Link
            to="/equipment"
            className="btn btn-sm rounded-3 px-3 py-2 fw-semibold"
            style={{
              border: '1.5px solid #0f6fd8',
              color: '#0f6fd8',
              backgroundColor: 'transparent',
              fontSize: '0.825rem',
            }}
          >
            + New Booking
          </Link>
        </div>

        {/* States */}
        {loading && <LoadingState />}

        {!loading && error && (
          <ErrorState message={error} onRetry={fetchBookings} />
        )}

        {!loading && !error && bookings.length === 0 && <EmptyState />}

        {/* Desktop table */}
        {!loading && !error && bookings.length > 0 && (
          <>
            <div className="d-none d-md-block" style={tableWrapStyle}>
              <table className="table mb-0" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['#', 'Equipment', 'Start Date', 'End Date', 'Total Price', 'Status'].map(
                      (heading) => (
                        <th key={heading} style={thStyle}>
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => {
                    const showPayNow = booking.status === 'confirmed' && booking.payment_status === 'pending';
                    const showPaidBadge = booking.payment_status === 'paid';
                    const showTrackOrder = booking.status === 'active' || booking.status === 'returned';

                    return (
                      <tr
                        key={booking.id}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbff',
                          transition: 'background-color 0.15s ease',
                          cursor: 'default',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f0f7ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            index % 2 === 0 ? '#ffffff' : '#fafbff';
                        }}
                      >
                        <td
                          style={{
                            ...tdStyle,
                            color: '#0f6fd8',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          #{booking.id}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>
                          {booking.equipment_name}
                        </td>
                        <td style={tdStyle}>{booking.start_date}</td>
                        <td style={tdStyle}>{booking.end_date}</td>
                        <td
                          style={{
                            ...tdStyle,
                            color: '#0f6fd8',
                            fontWeight: 700,
                          }}
                        >
                          {booking.total_price
                            ? `₹${Number(booking.total_price).toFixed(2)}`
                            : '—'}
                        </td>
                        <td style={tdStyle}>
                          <StatusBadge status={booking.status} />

                          <br />

                          {booking.notification && (
                            <div
                              style={{
                                marginTop: "8px",
                                padding: "8px",
                                borderRadius: "6px",
                                backgroundColor:
                                  booking.status === "confirmed"
                                    ? "#dcfce7"
                                    : "#fee2e2",
                                color:
                                  booking.status === "confirmed"
                                    ? "#166534"
                                    : "#991b1b",
                                fontWeight: "600",
                                fontSize: "13px",
                              }}
                            >
                              {booking.notification}
                            </div>
                          )}

                          <div className="d-flex align-items-center flex-wrap">
                            {showPayNow && <PayNowButton bookingId={booking.id} />}
                            {showPaidBadge && <PaidBadge />}
                            {showTrackOrder && <TrackOrderButton bookingId={booking.id} />}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="d-md-none">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}

        {/* ── Medicine Orders ─────────────────────────────────────────── */}
        <div className="mt-5 mb-4">
          <h2 style={sectionTitleStyle}>Medicine Orders</h2>
          {!medOrdersLoading && !medOrdersError && medicineOrders.length > 0 && (
            <p
              style={{
                color: '#6b7a99',
                fontSize: '0.85rem',
                marginTop: '0.3rem',
                marginBottom: 0,
              }}
            >
              {medicineOrders.length} order{medicineOrders.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {medOrdersLoading && <LoadingState />}

        {!medOrdersLoading && medOrdersError && (
          <ErrorState message={medOrdersError} onRetry={fetchMedicineOrders} />
        )}

        {!medOrdersLoading && !medOrdersError && medicineOrders.length === 0 && (
          <MedicineOrdersEmptyState />
        )}

        {!medOrdersLoading && !medOrdersError && medicineOrders.length > 0 && (
          <>
            <div className="d-none d-md-block" style={tableWrapStyle}>
              <table className="table mb-0" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Order ID', 'Medicine', 'Quantity', 'Total Amount', 'Order Status', 'Payment Status', 'Order Date', ''].map(
                      (heading) => (
                        <th key={heading} style={thStyle}>
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {medicineOrders.map((order, index) => {
                    const showTrackOrder = order.status !== 'pending' && order.status !== 'cancelled';

                    return (
                      <tr
                        key={order.id}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbff',
                          transition: 'background-color 0.15s ease',
                          cursor: 'default',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f0f7ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            index % 2 === 0 ? '#ffffff' : '#fafbff';
                        }}
                      >
                        <td
                          style={{
                            ...tdStyle,
                            color: '#0f6fd8',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          #{order.id}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>
                          {order.medicine_name}
                        </td>
                        <td style={tdStyle}>{order.quantity}</td>
                        <td
                          style={{
                            ...tdStyle,
                            color: '#0f6fd8',
                            fontWeight: 700,
                          }}
                        >
                          {order.total_price
                            ? `₹${Number(order.total_price).toFixed(2)}`
                            : '—'}
                        </td>
                        <td style={tdStyle}>
                          <MedicineStatusBadge status={order.status} label={order.status_display} />
                        </td>
                        <td style={tdStyle}>
                          <MedicinePaidBadge />
                        </td>
                        <td style={tdStyle}>
                          {new Date(order.ordered_at).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td style={tdStyle}>
                          {showTrackOrder && <TrackMedicineOrderButton orderId={order.id} />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="d-md-none">
              {medicineOrders.map((order) => (
                <MedicineOrderCard key={order.id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyBookingsPage;