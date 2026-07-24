import React from 'react';
import { useNavigate } from 'react-router-dom';

function BookingSuccessPage() {
  const navigate = useNavigate();

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid var(--brand-border)',
    boxShadow: 'var(--shadow-card)',
    padding: '2rem',
  };

  return (
    <div className="page-wrapper fade-in-up">
      <div className="container" style={{ maxWidth: '640px' }}>

        {/* Success card */}
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
            Booking Successful!
          </h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
            Your booking request has been submitted successfully.
          </p>
          <p style={{ color: 'var(--brand-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            Waiting for Admin Approval...
          </p>
        </div>

        {/* Info card */}
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
            What happens next?
          </h5>

          <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
            {[
              'Your booking has been received successfully.',
              'Our administrator will review your booking.',
              'Once approved, payment will become available.',
              'After successful payment, your equipment will be prepared for delivery.',
            ].map((item) => (
              <li
                key={item}
                style={{
                  color: 'var(--brand-muted)',
                  fontSize: '0.9rem',
                  lineHeight: 1.9,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
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
            onClick={() => navigate('/my-bookings')}
          >
            View My Bookings
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
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccessPage;