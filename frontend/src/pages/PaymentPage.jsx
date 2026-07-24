import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getBookingById, createPayment } from '../services/bookingService';

const PAYMENT_METHODS = [
  { key: 'upi', label: 'UPI' },
  { key: 'card', label: 'Card' },
  { key: 'cash', label: 'Cash' },
];

function generateFallbackTransactionId() {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `TXN${randomDigits}`;
}

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  const loadBooking = async () => {
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
  };

  useEffect(() => {
    loadBooking();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [bookingId]);

  const methodLabel = (key) =>
    PAYMENT_METHODS.find((m) => m.key === key)?.label || key;

  const handlePayNow = () => {
    setProcessing(true);

    // Simulated processing delay for a realistic feel — no gateway involved.
    setTimeout(async () => {
      try {
        const data = await createPayment({
          booking_id: booking.id,
          payment_method: selectedMethod,
        });

        toast.success(data.message || 'Payment successful.');

        navigate('/payment-success', {
          state: {
            transactionId: data.payment?.transaction_id || generateFallbackTransactionId(),
            paymentMethod: methodLabel(selectedMethod),
            amount: data.payment?.amount || booking.total_price,
          },
        });
      } catch (err) {
        toast.error(err.message || 'Payment failed. Please try again.');
        setProcessing(false);
      }
    }, 1500);
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid var(--brand-border)',
    boxShadow: 'var(--shadow-card)',
    padding: '2rem',
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 0',
    borderBottom: '1px solid var(--brand-border)',
    fontSize: '0.9rem',
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '320px', gap: '1rem' }}>
            <div className="spinner-border" role="status" style={{ color: 'var(--brand-primary)' }}>
              <span className="visually-hidden">Loading</span>
            </div>
            <p style={{ color: 'var(--brand-muted)', fontSize: '0.9rem' }}>Loading booking details…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: '640px' }}>
          <div
            className="d-flex align-items-start gap-3 p-4 rounded-3"
            style={{ backgroundColor: '#fff5f5', border: '1px solid #fecaca' }}
          >
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <p style={{ color: '#991b1b', fontWeight: 600, marginBottom: '0.25rem' }}>
                Failed to load booking
              </p>
              <p style={{ color: '#b91c1c', fontSize: '0.85rem', marginBottom: 0 }}>{error}</p>
            </div>
          </div>
          <Link
            to="/my-bookings"
            className="btn btn-sm mt-3 rounded-2"
            style={{
              border: '1.5px solid var(--brand-primary)',
              color: 'var(--brand-primary)',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
            }}
          >
            ← Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  if (booking.status !== 'confirmed') {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: '640px' }}>
          <div style={cardStyle} className="text-center">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚫</div>
            <h5 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.5rem' }}>
              This booking is not available for payment
            </h5>
            <p style={{ color: 'var(--brand-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Only bookings with a "Confirmed" status can be paid for. This booking is currently{' '}
              <strong>{booking.status_display || booking.status}</strong>.
            </p>
            <button
              className="btn rounded-3 fw-semibold"
              style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
              onClick={() => navigate('/my-bookings')}
            >
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper fade-in-up">
      <div className="container" style={{ maxWidth: '640px' }}>

        <div className="mb-4">
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              fontWeight: 700,
              color: 'var(--brand-text)',
              marginBottom: '0.25rem',
            }}
          >
            Payment
          </h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: '0.9rem' }}>
            Complete payment to activate your booking.
          </p>
        </div>

        {/* Booking summary */}
        <div style={cardStyle} className="mb-4">
          <h5
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              color: 'var(--brand-text)',
              marginBottom: '1rem',
              fontSize: '1.05rem',
            }}
          >
            Booking Summary
          </h5>

          <div style={rowStyle}>
            <span style={{ color: 'var(--brand-muted)' }}>Equipment Name</span>
            <span style={{ fontWeight: 600, color: 'var(--brand-text)' }}>
              {booking.equipment_name}
            </span>
          </div>

          <div style={rowStyle}>
            <span style={{ color: 'var(--brand-muted)' }}>Booking Dates</span>
            <span style={{ fontWeight: 600, color: 'var(--brand-text)' }}>
              {booking.start_date} → {booking.end_date}
            </span>
          </div>

          <div style={{ ...rowStyle, borderBottom: 'none', paddingTop: '0.9rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--brand-text)', fontSize: '1rem' }}>
              Amount
            </span>
            <span
              style={{
                fontWeight: 700,
                color: 'var(--brand-primary)',
                fontSize: '1.15rem',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              ₹{Number(booking.total_price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment method */}
        <div style={cardStyle} className="mb-4">
          <h5
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              color: 'var(--brand-text)',
              marginBottom: '1rem',
              fontSize: '1.05rem',
            }}
          >
            Select Payment Method
          </h5>

          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.key}
              className="form-check d-flex align-items-center gap-2 mb-2 p-3 rounded-3"
              style={{
                border: selectedMethod === method.key
                  ? '1.5px solid var(--brand-primary)'
                  : '1.5px solid var(--brand-border)',
                backgroundColor: selectedMethod === method.key
                  ? 'var(--brand-badge-bg)'
                  : 'transparent',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
              onClick={() => setSelectedMethod(method.key)}
            >
              <input
                className="form-check-input mt-0"
                type="radio"
                name="paymentMethod"
                id={method.key}
                value={method.key}
                checked={selectedMethod === method.key}
                onChange={() => setSelectedMethod(method.key)}
              />
              <label
                className="form-check-label mb-0"
                htmlFor={method.key}
                style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--brand-text)', cursor: 'pointer' }}
              >
                {method.label}
              </label>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn rounded-3 fw-semibold flex-grow-1"
            style={{
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '0.7rem 1.5rem',
              fontSize: '0.95rem',
            }}
            onClick={handlePayNow}
            disabled={processing}
          >
            {processing ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                Processing Payment...
              </span>
            ) : (
              `Pay ₹${Number(booking.total_price).toFixed(2)}`
            )}
          </button>

          <button
            className="btn rounded-3 fw-semibold"
            style={{
              border: '1.5px solid var(--brand-primary)',
              color: 'var(--brand-primary)',
              backgroundColor: 'transparent',
              padding: '0.7rem 1.2rem',
              fontSize: '0.95rem',
            }}
            onClick={() => navigate('/my-bookings')}
            disabled={processing}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;