import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookingById } from '../services/bookingService';

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'active', label: 'Active (Delivered)' },
  { key: 'returned', label: 'Returned' },
];

const STATUS_BADGE_STYLES = {
  pending: { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
  confirmed: { bg: '#dbeafe', color: '#1e40af', label: 'Confirmed' },
  active: { bg: '#dcfce7', color: '#166534', label: 'Active' },
  completed: { bg: '#1a2035', color: '#ffffff', label: 'Completed' },
  cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
  returned: { bg: '#e2e8f0', color: '#475569', label: 'Returned' },
};

const PAYMENT_STATUS_BADGE_STYLES = {
  pending: { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
  paid: { bg: '#dcfce7', color: '#166534', label: 'Paid' },
  failed: { bg: '#fee2e2', color: '#991b1b', label: 'Failed' },
};

function getStepIndex(status) {
  return TIMELINE_STEPS.findIndex((step) => step.key === status);
}

function StatusBadge({ status }) {
  const style = STATUS_BADGE_STYLES[status] || STATUS_BADGE_STYLES.returned;
  return (
    <span
      className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.3px',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: style.color,
          display: 'inline-block',
        }}
      />
      {style.label || status}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const style = PAYMENT_STATUS_BADGE_STYLES[status] || PAYMENT_STATUS_BADGE_STYLES.pending;
  return (
    <span
      className="badge rounded-pill px-3 py-2"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.3px',
      }}
    >
      {style.label || status}
    </span>
  );
}

function TrackingTimeline({ status }) {
  const currentIndex = getStepIndex(status);

  return (
    <div className="d-flex flex-column">
      {TIMELINE_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === TIMELINE_STEPS.length - 1;

        return (
          <div key={step.key} className="d-flex">
            {/* Step indicator column */}
            <div className="d-flex flex-column align-items-center me-3">
              <div
                className={isCurrent ? 'ot-step-glow' : ''}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted ? '#0f6fd8' : '#eef2f9',
                  color: isCompleted ? '#fff' : '#94a3b8',
                  fontSize: '1rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                }}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              {!isLast && (
                <div
                  style={{
                    width: '3px',
                    flexGrow: 1,
                    minHeight: '44px',
                    backgroundColor: index < currentIndex ? '#0f6fd8' : '#e2e8f2',
                    transition: 'background-color 0.4s ease',
                  }}
                />
              )}
            </div>

            {/* Step label */}
            <div style={{ paddingBottom: isLast ? 0 : '1.5rem', paddingTop: '0.4rem' }}>
              <div
                style={{
                  fontWeight: isCompleted ? 700 : 500,
                  color: isCompleted ? '#1a2035' : '#94a3b8',
                  fontSize: '1rem',
                  fontFamily: "'Sora', sans-serif",
                  transition: 'color 0.3s ease',
                }}
              >
                {step.label}
              </div>
              {isCurrent && (
                <span
                  className="badge rounded-pill mt-1"
                  style={{
                    backgroundColor: '#eaf2ff',
                    color: '#0f6fd8',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.7rem',
                  }}
                >
                  Current Status
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderTrackingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooking = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getBookingById(bookingId);
      setBooking(data.booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);


  useEffect(() => {
    loadBooking();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadBooking]);

  const heroStyle = {
    background: 'linear-gradient(135deg, #0f6fd8 0%, #2f8cf0 55%, #6bb4f7 100%)',
    padding: '3rem 1rem 4.5rem',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    border: '1px solid #eef2f9',
    boxShadow: '0 10px 40px rgba(15,111,216,0.09)',
    padding: '2rem',
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.7rem 0',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '0.9rem',
  };

  const scopedStyles = `
    @keyframes otFadeInUp {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .ot-fade-in {
      animation: otFadeInUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .ot-fade-in-delay-1 { animation-delay: 0.08s; }
    .ot-fade-in-delay-2 { animation-delay: 0.16s; }
    .ot-fade-in-delay-3 { animation-delay: 0.24s; }
    .ot-hover-lift:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(15,111,216,0.16) !important;
    }
    @keyframes otPulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(15,111,216,0.35); }
      70% { box-shadow: 0 0 0 9px rgba(15,111,216,0); }
      100% { box-shadow: 0 0 0 0 rgba(15,111,216,0); }
    }
    .ot-step-glow {
      animation: otPulseGlow 1.8s ease-in-out infinite;
    }
    .ot-btn-outline:hover {
      background-color: #eaf2ff !important;
    }
    .ot-btn-primary:hover {
      background-color: #0c5cb3 !important;
      transform: translateY(-2px);
    }
    .ot-btn-primary, .ot-btn-outline {
      transition: all 0.2s ease;
    }
    @keyframes otSpin {
      to { transform: rotate(360deg); }
    }
    .ot-spinner {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 4px solid #eaf2ff;
      border-top-color: #0f6fd8;
      animation: otSpin 0.8s linear infinite;
    }
    .ot-hero-orb {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.10);
      pointer-events: none;
    }
    @media (max-width: 767px) {
      .ot-card-padding { padding: 1.5rem !important; }
      .ot-summary-thumb { width: 64px !important; height: 64px !important; }
      .ot-hero-pad { padding: 2.25rem 1rem 3.75rem !important; }
    }
    @media (max-width: 400px) {
      .ot-card-padding { padding: 1.25rem !important; }
    }
  `;

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', backgroundColor: '#f4f7fc' }}>
        <style>{scopedStyles}</style>
        <div style={heroStyle} className="ot-hero-pad">
          <div className="ot-hero-orb" style={{ width: '220px', height: '220px', top: '-80px', right: '-60px' }} />
          <div className="container" style={{ maxWidth: '760px', position: 'relative' }}>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                marginBottom: '0.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Order Tracking
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: 0 }}>
              Track your equipment booking in real time.
            </p>
          </div>
        </div>
        <div className="container" style={{ maxWidth: '760px', marginTop: '-2.5rem' }}>
          <div
            style={cardStyle}
            className="ot-fade-in ot-card-padding d-flex flex-column align-items-center justify-content-center"
          >
            <div className="ot-spinner" role="status">
              <span className="visually-hidden">Loading</span>
            </div>
            <p style={{ color: '#6b7a99', fontSize: '0.9rem', marginTop: '1.25rem', marginBottom: 0, fontWeight: 500 }}>
              Loading order details…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '70vh', backgroundColor: '#f4f7fc' }}>
        <style>{scopedStyles}</style>
        <div style={heroStyle} className="ot-hero-pad">
          <div className="ot-hero-orb" style={{ width: '220px', height: '220px', top: '-80px', right: '-60px' }} />
          <div className="container" style={{ maxWidth: '760px', position: 'relative' }}>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                marginBottom: '0.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Order Tracking
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: 0 }}>
              Track your equipment booking in real time.
            </p>
          </div>
        </div>
        <div className="container" style={{ maxWidth: '760px', marginTop: '-2.5rem' }}>
          <div className="ot-fade-in" role="alert">
            <div
              className="alert alert-danger d-flex align-items-start gap-3 rounded-4"
              style={{ boxShadow: '0 10px 40px rgba(220,38,38,0.09)' }}
            >
              <span style={{ fontSize: '1.4rem' }}>⚠️</span>
              <div>
                <p className="fw-bold mb-1">We couldn't load this order</p>
                <p className="mb-3" style={{ fontSize: '0.9rem' }}>{error}</p>
                <Link
                  to="/my-bookings"
                  className="btn btn-sm rounded-3 ot-btn-outline"
                  style={{
                    border: '1.5px solid #0f6fd8',
                    color: '#0f6fd8',
                    backgroundColor: 'transparent',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  ← Back to My Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ minHeight: '70vh', backgroundColor: '#f4f7fc' }}>
        <style>{scopedStyles}</style>
        <div style={heroStyle} className="ot-hero-pad">
          <div className="ot-hero-orb" style={{ width: '220px', height: '220px', top: '-80px', right: '-60px' }} />
          <div className="container" style={{ maxWidth: '760px', position: 'relative' }}>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                marginBottom: '0.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Order Tracking
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: 0 }}>
              Track your equipment booking in real time.
            </p>
          </div>
        </div>
        <div className="container" style={{ maxWidth: '760px', marginTop: '-2.5rem' }}>
          <div className="alert alert-warning rounded-4 ot-fade-in" role="alert">
            Booking not found.
          </div>
        </div>
      </div>
    );
  }

  const badgeStyle = STATUS_BADGE_STYLES[booking.status] || STATUS_BADGE_STYLES.returned;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7fc', paddingBottom: '4rem' }}>
      <style>{scopedStyles}</style>

      {/* Hero */}
      <div style={heroStyle} className="ot-hero-pad">
        <div className="ot-hero-orb" style={{ width: '260px', height: '260px', top: '-100px', right: '-70px' }} />
        <div className="ot-hero-orb" style={{ width: '140px', height: '140px', bottom: '-60px', left: '10%' }} />
        <div className="container" style={{ maxWidth: '760px', position: 'relative' }}>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3" style={{ opacity: 0.85, fontSize: '0.85rem' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
            <span>→</span>
            <Link to="/my-bookings" style={{ color: '#fff', textDecoration: 'none' }}>My Bookings</Link>
            <span>→</span>
            <span>Order Tracking</span>
          </div>
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              marginBottom: '0.35rem',
              letterSpacing: '-0.02em',
            }}
          >
            Order Tracking
          </h1>
          <p style={{ opacity: 0.92, fontSize: '0.95rem', marginBottom: 0, maxWidth: '480px' }}>
            Track your equipment booking in real time.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '760px', marginTop: '-2.5rem' }}>

        {/* Booking summary card */}
        <div
          style={cardStyle}
          className="mb-4 ot-fade-in ot-hover-lift ot-card-padding"
        >
          <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
            <div
              className="ot-summary-thumb"
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '16px',
                backgroundColor: '#eaf2ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {booking.equipment_image ? (
                <img
                  src={booking.equipment_image}
                  alt={booking.equipment_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <svg width="38" height="38" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                  <rect width="56" height="56" rx="16" fill="#dbeafe" />
                  <path
                    d="M10 28h10l5-13 5.5 20 5-14.5 4 7.5h6"
                    stroke="#0f6fd8" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <div className="flex-grow-1">
              <h4
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  color: '#1a2035',
                  marginBottom: '0.2rem',
                  fontSize: '1.2rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {booking.equipment_name}
              </h4>
              <span style={{ fontSize: '0.85rem', color: '#6b7a99', fontWeight: 500 }}>
                Booking #{booking.id}
              </span>
            </div>

            <StatusBadge status={booking.status} />
          </div>

          {booking.created_at && (
            <div style={rowStyle}>
              <span style={{ color: '#6b7a99' }}>Booking Date</span>
              <span style={{ fontWeight: 700, color: '#1a2035' }}>
                {new Date(booking.created_at).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </span>
            </div>
          )}
          <div style={rowStyle}>
            <span style={{ color: '#6b7a99' }}>Rental Start Date</span>
            <span style={{ fontWeight: 700, color: '#1a2035' }}>{booking.start_date}</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#6b7a99' }}>Rental End Date</span>
            <span style={{ fontWeight: 700, color: '#1a2035' }}>{booking.end_date}</span>
          </div>
          {booking.payment_status && (
            <div style={rowStyle}>
              <span style={{ color: '#6b7a99' }}>Payment Status</span>
              <PaymentStatusBadge status={booking.payment_status} />
            </div>
          )}
          {booking.total_price != null && (
            <div style={{ ...rowStyle, borderBottom: 'none' }}>
              <span style={{ fontWeight: 700, color: '#1a2035' }}>Total Price</span>
              <span
                style={{
                  fontWeight: 800,
                  color: '#0f6fd8',
                  fontSize: '1.15rem',
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                ₹{Number(booking.total_price).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Tracking timeline / cancelled message */}
        <div style={cardStyle} className="mb-4 ot-fade-in ot-fade-in-delay-1 ot-hover-lift ot-card-padding">
          <h5
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              color: '#1a2035',
              marginBottom: '1.5rem',
              fontSize: '1.1rem',
              letterSpacing: '-0.01em',
            }}
          >
            Order Progress
          </h5>

          {booking.status === 'cancelled' ? (
            <div
              className="alert alert-danger d-flex align-items-center gap-3 rounded-4 mb-0"
              role="alert"
            >
              <span style={{ fontSize: '1.6rem' }}>❌</span>
              <div>
                <div className="fw-bold" style={{ fontSize: '1rem' }}>
                  Booking Cancelled
                </div>
                <div style={{ fontSize: '0.82rem' }}>
                  This booking will not proceed further.
                </div>
              </div>
            </div>
          ) : (
            <TrackingTimeline status={booking.status} />
          )}
        </div>

        {/* Information section */}
        <div style={cardStyle} className="mb-4 ot-fade-in ot-fade-in-delay-2 ot-hover-lift ot-card-padding">
          <h5
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              color: '#1a2035',
              marginBottom: '1rem',
              fontSize: '1.1rem',
              letterSpacing: '-0.01em',
            }}
          >
            Booking Information
          </h5>

          <div style={rowStyle}>
            <span style={{ color: '#6b7a99' }}>Booking Number</span>
            <span style={{ fontWeight: 700, color: '#1a2035' }}>#{booking.id}</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#6b7a99' }}>Equipment Name</span>
            <span style={{ fontWeight: 700, color: '#1a2035' }}>{booking.equipment_name}</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#6b7a99' }}>Rental Dates</span>
            <span style={{ fontWeight: 700, color: '#1a2035' }}>
              {booking.start_date} → {booking.end_date}
            </span>
          </div>
          <div style={{ ...rowStyle, borderBottom: booking.notification ? '1px solid #f1f5f9' : 'none' }}>
            <span style={{ color: '#6b7a99' }}>Current Status</span>
            <span style={{ fontWeight: 800, color: badgeStyle.color }}>
              {booking.status_display || booking.status}
            </span>
          </div>

          {booking.notification && (
            <div
              className="d-flex align-items-start gap-2 p-3 rounded-3 mt-3"
              style={{ backgroundColor: '#eaf2ff', border: '1px solid #dbeafe' }}
            >
              <span style={{ fontSize: '1.1rem' }}>🔔</span>
              <span style={{ color: '#1e40af', fontSize: '0.88rem', fontWeight: 600 }}>
                {booking.notification}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="d-flex flex-wrap gap-2 ot-fade-in ot-fade-in-delay-3">
          <button
            className="btn rounded-3 fw-semibold ot-btn-outline"
            style={{
              border: '1.5px solid #0f6fd8',
              color: '#0f6fd8',
              backgroundColor: 'transparent',
              padding: '0.7rem 1.4rem',
              fontSize: '0.9rem',
            }}
            onClick={() => navigate('/my-bookings')}
          >
            ← Back to My Bookings
          </button>

          {booking.status === 'active' && (
            <button
              className="btn rounded-3 fw-semibold ot-btn-primary"
              style={{
                backgroundColor: '#0f6fd8',
                color: '#fff',
                border: 'none',
                padding: '0.7rem 1.4rem',
                fontSize: '0.9rem',
              }}
              onClick={() => navigate(`/return-equipment/${booking.id}`)}
            >
              Return Equipment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderTrackingPage;