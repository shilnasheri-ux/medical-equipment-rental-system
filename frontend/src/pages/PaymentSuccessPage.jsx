import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    transactionId = '—',
    paymentMethod = '—',
    amount = null,
  } = location.state || {};

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

  return (
    <div className="page-wrapper fade-in-up">
      <div className="container" style={{ maxWidth: '640px' }}>

        <div style={cardStyle} className="text-center mb-4">
          <div
            style={{
              width: '64px', height: '64px',
              backgroundColor: '#d1fae5',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.75rem',
            }}
          >
            ✅
          </div>
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
              fontWeight: 700,
              color: 'var(--brand-text)',
              marginBottom: '0.5rem',
            }}
          >
            Payment Successful
          </h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: '0.9rem' }}>
            Your booking has been activated.
          </p>
        </div>

        <div style={cardStyle} className="mb-4">
          <div style={rowStyle}>
            <span style={{ color: 'var(--brand-muted)' }}>Transaction ID</span>
            <span style={{ fontWeight: 700, color: 'var(--brand-text)' }}>{transactionId}</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: 'var(--brand-muted)' }}>Payment Method</span>
            <span style={{ fontWeight: 600, color: 'var(--brand-text)' }}>{paymentMethod}</span>
          </div>
          {amount != null && (
            <div style={rowStyle}>
              <span style={{ color: 'var(--brand-muted)' }}>Amount Paid</span>
              <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                ₹{Number(amount).toFixed(2)}
              </span>
            </div>
          )}
          <div style={{ ...rowStyle, borderBottom: 'none' }}>
            <span style={{ color: 'var(--brand-muted)' }}>Booking Status</span>
            <span
              className="badge rounded-pill px-3 py-1"
              style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 600 }}
            >
              Active
            </span>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn rounded-3 fw-semibold flex-grow-1"
            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', fontSize: '0.95rem' }}
            onClick={() => navigate('/my-bookings')}
          >
            View My Bookings
          </button>
          <button
            className="btn rounded-3 fw-semibold"
            style={{ border: '1.5px solid var(--brand-primary)', color: 'var(--brand-primary)', backgroundColor: 'transparent', padding: '0.7rem 1.2rem', fontSize: '0.95rem' }}
            onClick={() => navigate('/')}
          >
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;