// src/components/home/HowItWorks.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    number: '01',
    title: 'Search Equipment',
    desc:  'Browse 200+ medical devices filtered by category, availability, and location.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#1E7BE2" strokeWidth="2" />
        <path d="M21 21l-4.35-4.35" stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Book Online',
    desc:  'Choose your rental dates and confirm your booking instantly — no phone calls needed.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="3" stroke="#1E7BE2" strokeWidth="2" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"
          stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Get it Delivered',
    desc:  'We deliver sanitised, tested equipment to your home — usually within 4 hours.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="#1E7BE2"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5.5" cy="18.5" r="2.5" stroke="#1E7BE2" strokeWidth="2" />
        <circle cx="18.5" cy="18.5" r="2.5" stroke="#1E7BE2" strokeWidth="2" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Return When Done',
    desc:  'Schedule a free pickup when your rental period ends — we handle everything.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 12a9 9 0 109-9 9 9 0 00-6.36 2.64L3 8"
          stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 3v5h5" stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '5rem 0' }}>
      <div className="container">

        {/* Header */}
        <div className="text-center mb-5">
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            color: '#1E7BE2',
          }}>
            Simple Process
          </span>
          <h2 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 'clamp(1.5rem, 3vw, 1.9rem)',
            fontWeight: 800, color: '#0A1628',
            marginTop: '0.3rem', marginBottom: '0.6rem',
          }}>
            How It Works
          </h2>
          <p style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.95rem', color: '#64748B', maxWidth: 480, margin: '0 auto',
          }}>
            Renting medical equipment takes less than 3 minutes from search to confirmation.
          </p>
        </div>

        {/* Steps */}
        <div className="row g-4 position-relative">
          {STEPS.map((step, i) => (
            <div key={step.number} className="col-12 col-sm-6 col-lg-3 position-relative">
              {/* Connector line (desktop only, between steps) */}
              {i < STEPS.length - 1 && (
                <div className="d-none d-lg-block step-connector" />
              )}

              <div className="glass-card p-4 h-100">
                {/* Icon circle */}
                <div style={{
                  width: 56, height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EBF4FF 0%, #DCEBFF 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                  position: 'relative',
                }}>
                  {step.icon}
                  {/* Step number badge */}
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 20, height: 20,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1E7BE2, #0F4C96)',
                    color: '#fff',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.6rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {i + 1}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '1.02rem', fontWeight: 700, color: '#0A1628',
                  marginBottom: '0.4rem',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.83rem', color: '#64748B', lineHeight: 1.6, marginBottom: 0,
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-5">
          <Link to="/equipment" className="btn-medical-primary">
            Start Browsing Equipment
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}