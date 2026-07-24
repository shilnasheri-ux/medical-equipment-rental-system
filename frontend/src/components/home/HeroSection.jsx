// src/components/home/HeroSection.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    label: 'Same Day Delivery',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="var(--blue-500)" strokeWidth="2" />
        <path d="M12 7v5l3 3" stroke="var(--blue-500)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Sanitized Equipment',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke="var(--blue-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" stroke="var(--blue-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Affordable Rental',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" stroke="var(--blue-500)" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
          stroke="var(--blue-500)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function HeroSection() {
  return (
    <section
      style={{
        backgroundColor: '#FFFFFF',
        padding: '6rem 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Very subtle background blur — the only decorative element allowed */}
      <div
        aria-hidden="true"
        className="position-absolute d-none d-lg-block"
        style={{
          top: '10%',
          right: '-6%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--blue-50) 0%, transparent 72%)',
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container position-relative">
        <div className="row align-items-center g-5">

          {/* ── Left: copy ── */}
          <div className="col-12 col-lg-6">
            <span
              className="fade-up delay-1"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
                color: 'var(--blue-500)',
                display: 'block',
                marginBottom: '1.25rem',
              }}
            >
              Trusted Medical Equipment
            </span>

            <h1
              className="fade-up delay-2"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
                fontWeight: 800,
                color: 'var(--blue-900)',
                lineHeight: 1.15,
                marginBottom: '1.5rem',
              }}
            >
              Medical Equipment
              <br />
              Delivered to
              <br />
              <span style={{ color: 'var(--blue-500)' }}>Your Door</span>
            </h1>

            <p
              className="fade-up delay-3"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.05rem',
                color: '#64748B',
                lineHeight: 1.8,
                maxWidth: 460,
                marginBottom: '2.25rem',
              }}
            >
              Rent hospital-grade wheelchairs, oxygen concentrators, hospital
              beds, and more — delivered to your home, set up by trained
              staff, and picked up free when you're done.
            </p>

            <div className="fade-up delay-4 d-flex flex-column flex-sm-row gap-3 mb-4">
              <Link
                to="/equipment"
                className="btn-medical-primary justify-content-center"
              >
                Browse Equipment
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="#fff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                to="/recovery-kit"
                className="btn-medical-outline justify-content-center"
              >
                Recovery Kits
              </Link>
            </div>

            <div className="fade-up delay-5 d-flex flex-wrap gap-4">
              {FEATURES.map((f) => (
                <span
                  key={f.label}
                  className="d-flex align-items-center gap-2"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--blue-900)',
                  }}
                >
                  {f.icon}
                  {f.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: single hero image ── */}
          <div className="col-12 col-lg-6 fade-up delay-3">
            <div className="hero-image-frame mx-auto mx-lg-0">
              {/*
                DEVELOPER TODO:
                Place the real photo at: public/images/hero-equipment.jpg
                (hospital bed + wheelchair + oxygen concentrator, shot on a
                plain white/light background so it blends with the section).
                This <img> references the public folder by path (not a
                bundler import), so the build will NOT fail if the file is
                missing yet — it will just show a broken-image icon until
                the file is added. No other code changes are needed once
                the photo is in place.
              */}
              <img
                src="/images/hero-equipment.png"
                alt="Hospital bed, wheelchair, and oxygen concentrator available for rental"
                className="img-fluid w-100 hero-image"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}