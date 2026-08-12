import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookingById, requestReturn } from '../services/bookingService';

const STATUS_BADGE_STYLES = {
  pending: { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
  confirmed: { bg: '#dbeafe', color: '#1e40af', label: 'Confirmed' },
  active: { bg: '#dcfce7', color: '#166534', label: 'Active' },
  completed: { bg: '#1a2035', color: '#ffffff', label: 'Completed' },
  cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
  returned: { bg: '#e2e8f0', color: '#475569', label: 'Returned' },
};

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

function ReturnEquipmentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [returnError, setReturnError] = useState('');

  const loadBooking = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getBookingById(bookingId);
      setBooking(data.booking);
      setRequestSubmitted(Boolean(data.booking?.return_requested));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [bookingId, loadBooking]);

  const handleRequestReturn = async () => {
    setReturnError('');

    try {
      setSubmitting(true);

      const data = await requestReturn(bookingId);

      setBooking(data.booking);      // booking update
      setRequestSubmitted(true);
      setShowSuccessAlert(true);

    } catch (err) {
      setReturnError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
    @keyframes reFadeInUp {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .re-fade-in {
      animation: reFadeInUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .re-fade-in-delay-1 { animation-delay: 0.08s; }
    .re-fade-in-delay-2 { animation-delay: 0.16s; }
    .re-fade-in-delay-3 { animation-delay: 0.24s; }
    .re-hover-lift:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(15,111,216,0.16) !important;
    }
    .re-btn-outline:hover {
      background-color: #eaf2ff !important;
    }
    .re-btn-primary:hover:not(:disabled) {
      background-color: #0c5cb3 !important;
      transform: translateY(-2px);
    }
    .re-btn-primary:disabled {
      cursor: not-allowed;
    }
    .re-btn-primary, .re-btn-outline {
      transition: all 0.2s ease;
    }
    @keyframes reSpin {
      to { transform: rotate(360deg); }
    }
    .re-spinner {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 4px solid #eaf2ff;
      border-top-color: #0f6fd8;
      animation: reSpin 0.8s linear infinite;
    }
    .re-hero-orb {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.10);
      pointer-events: none;
    }
    @media (max-width: 767px) {
      .re-card-padding { padding: 1.5rem !important; }
      .re-summary-thumb { width: 64px !important; height: 64px !important; }
      .re-hero-pad { padding: 2.25rem 1rem 3.75rem !important; }
      .re-actions { flex-direction: column-reverse; }
      .re-actions .btn { width: 100%; }
    }
    @media (max-width: 400px) {
      .re-card-padding { padding: 1.25rem !important; }
    }
  `;

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', backgroundColor: '#f4f7fc' }}>
        <style>{scopedStyles}</style>
        <div style={heroStyle} className="re-hero-pad">
          <div className="re-hero-orb" style={{ width: '220px', height: '220px', top: '-80px', right: '-60px' }} />
          <div className="container" style={{ maxWidth: '640px', position: 'relative' }}>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                marginBottom: '0.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Return Equipment
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: 0 }}>
              Request the return of your rented equipment safely and easily.
            </p>
          </div>
        </div>
        <div className="container" style={{ maxWidth: '640px', marginTop: '-2.5rem' }}>
          <div
            style={cardStyle}
            className="re-fade-in re-card-padding d-flex flex-column align-items-center justify-content-center"
          >
            <div className="re-spinner" role="status">
              <span className="visually-hidden">Loading</span>
            </div>
            <p style={{ color: '#6b7a99', fontSize: '0.9rem', marginTop: '1.25rem', marginBottom: 0, fontWeight: 500 }}>
              Loading booking details…
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
        <div style={heroStyle} className="re-hero-pad">
          <div className="re-hero-orb" style={{ width: '220px', height: '220px', top: '-80px', right: '-60px' }} />
          <div className="container" style={{ maxWidth: '640px', position: 'relative' }}>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                marginBottom: '0.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Return Equipment
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: 0 }}>
              Request the return of your rented equipment safely and easily.
            </p>
          </div>
        </div>
        <div className="container" style={{ maxWidth: '640px', marginTop: '-2.5rem' }}>
          <div
            className="re-fade-in re-card-padding p-4 p-md-5 rounded-4 text-center"
            style={{
              backgroundColor: '#fff',
              border: '1px solid #fecaca',
              boxShadow: '0 10px 40px rgba(220,38,38,0.09)',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.7rem',
              }}
            >
              ⚠️
            </div>
            <p style={{ color: '#991b1b', fontWeight: 700, marginBottom: '0.35rem', fontSize: '1.1rem', fontFamily: "'Sora', sans-serif" }}>
              We couldn't load this booking
            </p>
            <p style={{ color: '#b91c1c', fontSize: '0.88rem', marginBottom: '1.75rem' }}>{error}</p>
            <Link
              to="/my-bookings"
              className="btn rounded-3 re-btn-outline"
              style={{
                border: '1.5px solid #0f6fd8',
                color: '#0f6fd8',
                backgroundColor: 'transparent',
                fontSize: '0.9rem',
                fontWeight: 600,
                padding: '0.65rem 1.5rem',
              }}
            >
              ← Back to My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const status = booking.status;
  const badgeStyle = STATUS_BADGE_STYLES[status] || STATUS_BADGE_STYLES.returned;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7fc', paddingBottom: '4rem' }}>
      <style>{scopedStyles}</style>

      {/* Hero */}
      <div style={heroStyle} className="re-hero-pad">
        <div className="re-hero-orb" style={{ width: '260px', height: '260px', top: '-100px', right: '-70px' }} />
        <div className="re-hero-orb" style={{ width: '140px', height: '140px', bottom: '-60px', left: '10%' }} />
        <div className="container" style={{ maxWidth: '640px', position: 'relative' }}>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3" style={{ opacity: 0.85, fontSize: '0.85rem' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
            <span>→</span>
            <Link to="/my-bookings" style={{ color: '#fff', textDecoration: 'none' }}>My Bookings</Link>
            <span>→</span>
            <span>Return Equipment</span>
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
            Return Equipment
          </h1>
          <p style={{ opacity: 0.92, fontSize: '0.95rem', marginBottom: 0, maxWidth: '480px' }}>
            Request the return of your rented equipment safely and easily.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '640px', marginTop: '-2.5rem' }}>

        {showSuccessAlert && (
          <div
            className="alert d-flex align-items-center gap-2 rounded-4 mb-4 re-fade-in"
            role="alert"
            style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontWeight: 600,
              padding: '1rem 1.25rem',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>✅</span>
            <span>Return request submitted successfully.</span>
          </div>
        )}

        {returnError && (
          <div
            className="alert d-flex align-items-center gap-2 rounded-4 mb-4 re-fade-in"
            role="alert"
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontWeight: 600,
              padding: '1rem 1.25rem',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <span>{returnError}</span>
          </div>
        )}

        {/* Booking summary card */}
        <div
          style={cardStyle}
          className="mb-4 re-fade-in re-hover-lift re-card-padding"
        >
          <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
            <div
              className="re-summary-thumb"
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

            <StatusBadge status={status} />
          </div>

          <div style={rowStyle}>
            <span style={{ color: '#6b7a99' }}>Start Date</span>
            <span style={{ fontWeight: 700, color: '#1a2035' }}>{booking.start_date}</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#6b7a99' }}>End Date</span>
            <span style={{ fontWeight: 700, color: '#1a2035' }}>{booking.end_date}</span>
          </div>
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

        {/* Booking information card */}
        <div style={cardStyle} className="mb-4 re-fade-in re-fade-in-delay-1 re-hover-lift re-card-padding">
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
          <div style={{ ...rowStyle, borderBottom: 'none' }}>
            <span style={{ color: '#6b7a99' }}>Current Status</span>
            <span style={{ fontWeight: 800, color: badgeStyle.color }}>
              {booking.status_display || status}
            </span>
          </div>
        </div>

        {/* Status-driven return panel */}
        <div style={cardStyle} className="mb-4 re-fade-in re-fade-in-delay-2 re-hover-lift re-card-padding">
          <h5
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              color: '#1a2035',
              marginBottom: '1.25rem',
              fontSize: '1.1rem',
              letterSpacing: '-0.01em',
            }}
          >
            Request Return
          </h5>

          {status === 'active' && booking.return_requested && (
            <div
              className="d-flex align-items-start gap-3 p-4 rounded-4"
              style={{ backgroundColor: '#eaf2ff', border: '1px solid #dbeafe' }}
            >
              <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
              <div>
                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    color: '#1e40af',
                    fontSize: '0.95rem',
                    marginBottom: '0.3rem',
                  }}
                >
                  Return Request Submitted
                </div>
                <div style={{ color: '#1e40af', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.6 }}>
                  Your return request has been submitted successfully.
                  Our team will contact you soon to schedule pickup.
                </div>
              </div>
            </div>
          )}

          {status === 'active' && !booking.return_requested && (
            <>

              {/* Return information notice */}
              <div
                className="d-flex align-items-start gap-2 p-3 rounded-3 mb-4"
                style={{ backgroundColor: '#eaf2ff', border: '1px solid #dbeafe' }}
              >
                <span style={{ fontSize: '1.1rem' }}>ℹ️</span>
                <div style={{ color: '#1e40af', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 800, marginBottom: '0.2rem' }}>Return Request Information</div>
                  After submitting your return request, our team will verify the
                  request and schedule equipment pickup.
                </div>
              </div>

              <p style={{ color: '#1a2035', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                You can request equipment return.
              </p>
              <button
                className="btn rounded-3 fw-semibold re-btn-primary"
                style={{
                  backgroundColor: requestSubmitted ? '#94a3b8' : '#0f6fd8',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.75rem',
                  fontSize: '0.95rem',
                }}
                onClick={handleRequestReturn}
                disabled={requestSubmitted || submitting}
              >
                {submitting ? (
                  <span className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.4)',
                        borderTopColor: '#fff',
                        display: 'inline-block',
                        animation: 'reSpin 0.7s linear infinite',
                      }}
                    />
                    Submitting…
                  </span>
                ) : requestSubmitted ? (
                  'Return Requested'
                ) : (
                  'Request Return'
                )}
              </button>
            </>
          )}

          {status === 'returned' && (
            <div
              className="d-flex align-items-center gap-3 p-4 rounded-4"
              style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }}
            >
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <span style={{ color: '#166534', fontWeight: 800, fontSize: '0.95rem' }}>
                Equipment has already been returned.
              </span>
            </div>
          )}

          {status === 'cancelled' && (
            <div
              className="d-flex align-items-center gap-3 p-4 rounded-4"
              style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}
            >
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <span style={{ color: '#991b1b', fontWeight: 800, fontSize: '0.95rem' }}>
                Cancelled bookings cannot be returned.
              </span>
            </div>
          )}

          {(status === 'pending' || status === 'confirmed') && (
            <>
              <p style={{ color: '#6b7a99', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Return is available only after delivery.
              </p>
              <button
                className="btn rounded-3 fw-semibold"
                style={{
                  backgroundColor: '#94a3b8',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.75rem',
                  fontSize: '0.95rem',
                  cursor: 'not-allowed',
                }}
                disabled
              >
                Request Return
              </button>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="d-flex flex-wrap gap-2 re-actions re-fade-in re-fade-in-delay-3">
          <button
            className="btn rounded-3 fw-semibold re-btn-outline"
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
        </div>
      </div>
    </div>
  );
}

export default ReturnEquipmentPage;