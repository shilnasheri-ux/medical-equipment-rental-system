import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchEquipmentById, fetchEquipmentList } from '../services/equipmentService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert     from '../components/ErrorAlert';
import BookingModal from '../components/booking/BookingModal';
import { useAuth } from '../context/AuthContext';

// ─── Small sub-components ────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  if (value == null || value === '') return null;
  return (
    <div
      className="d-flex justify-content-between align-items-start py-2"
      style={{ borderBottom: '1px solid var(--brand-border)', fontSize: '0.875rem' }}
    >
      <span style={{ color: 'var(--brand-muted)', minWidth: '140px' }}>{label}</span>
      <span style={{ color: 'var(--brand-text)', fontWeight: 500, textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}

function AvailabilityBadge({ isAvailable }) {
  const ok = isAvailable !== false;
  return (
    <span
      className="badge rounded-pill px-3 py-2"
      style={{
        backgroundColor: ok ? '#d1fae5' : '#fee2e2',
        color:           ok ? '#065f46' : '#991b1b',
        fontSize: '0.8rem',
        fontWeight: 600,
      }}
    >
      {ok ? '● Available for Rent' : '● Currently Unavailable'}
    </span>
  );
}

// ─── Related Equipment card ──────────────────────────────────────────────────
function RelatedEquipmentCard({ item, navigate }) {
  return (
    <div className="col-12 col-sm-6 col-md-4">
      <div
        className="rounded-3 overflow-hidden h-100 d-flex flex-column"
        style={{
          backgroundColor: '#fff',
          border: '1px solid var(--brand-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          style={{
            height: '160px',
            backgroundColor: 'var(--brand-badge-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <svg width="48" height="48" viewBox="0 0 56 56" fill="none" aria-hidden="true">
              <rect width="56" height="56" rx="16" fill="#dbeafe" />
              <path
                d="M10 28h10l5-13 5.5 20 5-14.5 4 7.5h6"
                stroke="var(--brand-primary)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <div className="p-3 d-flex flex-column flex-grow-1">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            {item.category && (
              <span
                className="badge rounded-pill px-2 py-1"
                style={{
                  backgroundColor: 'var(--brand-badge-bg)',
                  color: 'var(--brand-badge-text)',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                }}
              >
                {item.category}
              </span>
            )}
            <AvailabilityBadge isAvailable={item.availability} />
          </div>

          <h6
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--brand-text)',
              marginBottom: '0.4rem',
            }}
          >
            {item.name}
          </h6>

          {item.price_per_day != null && (
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--brand-primary)',
                fontFamily: "'Sora', sans-serif",
                marginBottom: '0.75rem',
              }}
            >
              ₹{Number(item.price_per_day).toFixed(0)}
              <span style={{ fontSize: '0.7rem', color: 'var(--brand-muted)', fontWeight: 500 }}>
                {' '}/ day
              </span>
            </div>
          )}

          <button
            className="btn btn-sm rounded-3 fw-semibold mt-auto"
            style={{
              border: '1.5px solid var(--brand-primary)',
              color: 'var(--brand-primary)',
              backgroundColor: 'transparent',
              fontSize: '0.82rem',
            }}
            onClick={() => navigate(`/equipment/${item.id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
function EquipmentDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { isLoggedIn } = useAuth();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [relatedEquipment, setRelatedEquipment] = useState([]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchEquipmentById(id);
      console.log(res.data);
      console.log("DETAIL PAGE WORKING");
      setEquipment(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Load related equipment (same category, available, excluding current item)
  useEffect(() => {
    const loadRelated = async () => {
      if (!equipment?.category) {
        setRelatedEquipment([]);
        return;
      }

      try {
        const res = await fetchEquipmentList({ category: equipment.category });
        const list = Array.isArray(res.data) ? res.data : res.data?.results || [];

        const filtered = list
          .filter((item) => String(item.id) !== String(id))
          .filter((item) => item.availability !== false)
          .slice(0, 3);

        setRelatedEquipment(filtered);
      } catch (err) {
        // Fail silently — related suggestions are non-critical to the page
        setRelatedEquipment([]);
      }
    };

    loadRelated();
  }, [equipment, id]);

  const handleBookNowClick = () => {
  if (!isLoggedIn) {
    navigate('/login');
    return;
  }

  setIsBookingModalOpen(true);
};

const handleBookingSuccess = () => {
  setIsBookingModalOpen(false);
  navigate('/booking-success');
};

  if (loading) return (
    <div className="page-wrapper">
      <div className="container">
        <LoadingSpinner message="Loading equipment details…" />
      </div>
    </div>
  );

  if (error) return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '640px' }}>
        <ErrorAlert message={error} onRetry={loadEquipment} />
        <Link
          to="/equipment"
          className="btn btn-sm mt-3 rounded-2"
          style={{
            border: '1.5px solid var(--brand-primary)',
            color: 'var(--brand-primary)',
            backgroundColor: 'transparent',
            fontSize: '0.875rem',
          }}
        >
          ← Back to Equipment
        </Link>
      </div>
    </div>
  );

  if (!equipment) return null;

  const {
    name,
    description,
    price_per_day,
    availability,
    category,
    image,
  } = equipment;


  console.log("RENDERING", equipment);
  return (
  <>
    <div className="page-wrapper fade-in-up">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb" style={{ fontSize: '0.8rem' }}>
            <li className="breadcrumb-item">
              <Link to="/" style={{ color: 'var(--brand-primary)' }}>Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/equipment" style={{ color: 'var(--brand-primary)' }}>Equipment</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">{name}</li>
          </ol>
        </nav>

        <div
          className="rounded-3 overflow-hidden"
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--brand-border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="row g-0">
            {/* ── Left: Image ── */}
            <div className="col-12 col-md-5">
              <div
                style={{
                  height: '100%',
                  minHeight: '320px',
                  backgroundColor: 'var(--brand-badge-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <svg
                    width="80" height="80" viewBox="0 0 56 56" fill="none"
                    aria-hidden="true"
                  >
                    <rect width="56" height="56" rx="16" fill="#dbeafe" />
                    <path
                      d="M10 28h10l5-13 5.5 20 5-14.5 4 7.5h6"
                      stroke="var(--brand-primary)" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* ── Right: Details ── */}
            <div className="col-12 col-md-7 p-4 p-lg-5">
              {/* Category + availability */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                {category && (
                  <span
                    className="badge rounded-pill px-2 py-1"
                    style={{
                      backgroundColor: 'var(--brand-badge-bg)',
                      color: 'var(--brand-badge-text)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}
                  >
                    {category}
                  </span>
                )}
                <AvailabilityBadge isAvailable={availability} />
              </div>

              {/* Name */}
              <h1
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  fontWeight: 700,
                  color: 'var(--brand-text)',
                  lineHeight: 1.2,
                  marginBottom: '0.75rem',
                }}
              >
                {name}
              </h1>

              {/* Description */}
              <p
                style={{
                  color: 'var(--brand-muted)',
                  lineHeight: 1.7,
                  fontSize: '0.9rem',
                  marginBottom: '1.5rem',
                }}
              >
                {description || 'No description available for this item.'}
              </p>

              {/* Pricing grid */}
              <div
                className="d-flex flex-wrap gap-3 p-3 rounded-3 mb-4"
                style={{ backgroundColor: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}
              >
                {[
                  { label: 'Daily',   value: price_per_day  },
                ].map(({ label, value }) =>
                  value != null ? (
                    <div key={label} className="text-center flex-grow-1">
                      <div
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 700,
                          color: 'var(--brand-primary)',
                          fontFamily: "'Sora', sans-serif",
                        }}
                      >
                        ₹{Number(value).toFixed(0)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--brand-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {label}
                      </div>
                    </div>
                  ) : null
                )}
              </div>

              {/* Spec table */}
              <div className="mb-4">
              </div>

              {/* Action buttons */}
              <div className="d-flex flex-wrap gap-2">
                {/* <button
                  className="btn rounded-3 fw-semibold flex-grow-1"
                  style={{
                    backgroundColor: availability !== false ? 'var(--brand-primary)' : '#94a3b8',
                    color: '#fff',
                    border: 'none',
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.9rem',
                    cursor: availability  !== false ? 'pointer' : 'not-allowed',
                  }}
                  disabled={availability === false}
                >
                  {availability !== false ? 'Book Now' : 'Not Available'}
                </button> */}

<button
  className="btn rounded-3 fw-semibold flex-grow-1"
  style={{
    backgroundColor: availability !== false ? "#2563eb" : "#94a3b8",
    color: "#fff",
    border: "none",
    padding: "0.65rem 1.5rem",
    fontSize: "0.9rem",
    cursor: availability !== false ? "pointer" : "not-allowed",
  }}
  disabled={availability === false}
  onClick={handleBookNowClick}
>
  {availability !== false ? "Book Now" : "Not Available"}
</button>

<button
                  className="btn rounded-3 fw-semibold"
                  style={{
                    border: '1.5px solid var(--brand-primary)',
                    color: 'var(--brand-primary)',
                    backgroundColor: 'transparent',
                    padding: '0.65rem 1.2rem',
                    fontSize: '0.9rem',
                  }}
                  onClick={() => navigate(-1)}
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Equipment ── */}
        {relatedEquipment.length > 0 && (
          <div className="mt-5">
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--brand-text)',
                marginBottom: '0.25rem',
              }}
            >
              Related Equipment
            </h2>
            <p style={{ color: 'var(--brand-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              You may also be interested in these items.
            </p>

            <div className="row g-3">
              {relatedEquipment.map((item) => (
                <RelatedEquipmentCard key={item.id} item={item} navigate={navigate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    
    <BookingModal
  isOpen={isBookingModalOpen}
  onClose={() => setIsBookingModalOpen(false)}
  equipmentId={id}
  equipmentName={name}
  onBookingSuccess={handleBookingSuccess}
/>

</>
    
  );
}

export default EquipmentDetailPage;   