// src/components/home/HomeCTA.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function HomeCTA() {
  const { isLoggedIn } = useAuth();

  return (
    <section style={{ backgroundColor: '#F0F6FF', padding: '5rem 0' }}>
      <div className="container">
        <div
          className="glass-card text-center px-4 py-5 px-md-5"
          style={{
            background: 'linear-gradient(135deg, #1E7BE2 0%, #0F4C96 100%)',
            border: 'none',
            borderRadius: 28,
            boxShadow: '0 24px 64px rgba(15,76,150,0.30)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative ring */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: -80, right: -80,
            width: 300, height: 300, borderRadius: '50%',
            border: '40px solid rgba(255,255,255,0.06)',
            pointerEvents: 'none',
          }} />

          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
            display: 'block', marginBottom: '0.75rem',
          }}>
            Get Started Today
          </span>

          <h2 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
            fontWeight: 800, color: '#FFFFFF',
            marginBottom: '0.75rem',
          }}>
            Need Medical Equipment at Home?
          </h2>

          <p style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.72)',
            maxWidth: 480, margin: '0 auto 2rem',
            lineHeight: 1.7,
          }}>
            Browse our catalogue, book online in minutes, and receive hospital-grade
            equipment at your doorstep — no prescription required for OTC devices.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/equipment" className="btn-medical-ghost">
              Browse Equipment
            </Link>
            {!isLoggedIn && (
              <Link
                to="/register"
                style={{
                  background: '#FFFFFF',
                  color: '#1E7BE2',
                  borderRadius: 12,
                  padding: '0.75rem 1.75rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
              >
                Create Free Account
              </Link>
            )}
            {isLoggedIn && (
              <Link to="/my-bookings" className="btn-medical-ghost">
                View My Bookings
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}