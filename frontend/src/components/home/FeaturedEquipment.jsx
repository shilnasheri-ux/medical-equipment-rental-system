// src/components/home/FeaturedEquipment.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEquipmentList } from '../../services/equipmentService';

function EquipmentCardSmall({ item }) {
  const [hovered, setHovered] = useState(false);

  const isAvailable = item.availability_status === 'available';
  const price = item.price_per_day ?? item.daily_rate ?? null;

  return (
    <div
      className="eq-card glass-card h-100 d-flex flex-column"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 20px 48px rgba(15,76,150,0.14)'
          : '0 4px 18px rgba(15,76,150,0.07)',
      }}
    >
      {/* Image */}
      <div style={{
        height: 178,
        backgroundColor: '#F0F6FF',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="eq-card-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100">
            <svg width="52" height="52" viewBox="0 0 56 56" fill="none">
              <rect width="56" height="56" rx="16" fill="#DCEBFF" />
              <path d="M10 28h10l5-13 5.5 20 5-14.5 4 7.5h6"
                stroke="#1E7BE2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* Availability dot */}
        <span
          className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill"
          style={{
            background: isAvailable ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
            color: isAvailable ? '#16A34A' : '#DC2626',
            fontSize: '0.68rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
          }}
        >
          {isAvailable ? '● Available' : '● Unavailable'}
        </span>
      </div>

      {/* Body */}
      <div className="d-flex flex-column flex-grow-1 p-3">
        {item.category && (
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#1E7BE2',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '0.3rem',
            display: 'block',
          }}>
            {item.category_display || item.category}
          </span>
        )}

        <h3 style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '0.98rem',
          fontWeight: 700,
          color: '#0A1628',
          marginBottom: '0.3rem',
          lineHeight: 1.3,
        }}>
          {item.name}
        </h3>

        <p style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '0.8rem',
          color: '#64748B',
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flexGrow: 1,
          marginBottom: '0.85rem',
        }}>
          {item.description || 'Quality medical equipment available for rent.'}
        </p>

        <div className="d-flex align-items-center justify-content-between mt-auto"
          style={{ borderTop: '1px solid rgba(30,123,226,0.08)', paddingTop: '0.75rem' }}>
          <div>
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#1E7BE2',
            }}>
              {price != null ? `₹${Number(price).toFixed(0)}` : '—'}
            </span>
            {price != null && (
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.7rem',
                color: '#94A3B8',
                marginLeft: 3,
              }}>/day</span>
            )}
          </div>
          <Link
            to={`/equipment/${item.id}`}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#1E7BE2',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            View
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#1E7BE2" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedEquipment() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipmentList({ status: 'available' })
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        setItems(list.slice(0, 4));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ backgroundColor: '#F8FBFF', padding: '5rem 0' }}>
      <div className="container">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-end
          justify-content-between gap-3 mb-5">
          <div>
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#1E7BE2',
            }}>
              Featured Equipment
            </span>
            <h2 style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(1.5rem, 3vw, 1.9rem)',
              fontWeight: 800,
              color: '#0A1628',
              marginTop: '0.3rem',
              marginBottom: 0,
            }}>
              Most Rented This Week
            </h2>
          </div>
          <Link
            to="/equipment"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#1E7BE2',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            View Full Catalogue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#1E7BE2" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border"
              style={{ color: '#1E7BE2', width:'2.4rem', height:'2.4rem' }} />
          </div>
        ) : items.length === 0 ? (
          <p style={{ fontFamily:"'Poppins',sans-serif", color:'#64748B', textAlign:'center' }}>
            No equipment available right now.
          </p>
        ) : (
          <div className="row g-4">
            {items.map((item, i) => (
              <div key={item.id} className={`col-12 col-sm-6 col-lg-3 fade-up delay-${i + 1}`}>
                <EquipmentCardSmall item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}