// src/components/home/WhyChooseUs.jsx

import React from 'react';

const REASONS = [
  {
    title: 'Hospital-Grade Quality',
    desc: 'Every item is sanitised, tested, and certified before each rental.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Same-Day Delivery',
    desc: 'Order before noon for guaranteed same-day delivery in your city.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#1E7BE2" strokeWidth="2" />
        <path d="M12 7v5l3 3" stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Flexible Rental Periods',
    desc: 'Rent for a day, a week, or a month. Extend anytime without extra fees.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="3" stroke="#1E7BE2" strokeWidth="2" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: '24/7 Medical Support',
    desc: 'Our trained staff are available round the clock for setup and troubleshooting.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
          stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Transparent Pricing',
    desc: 'No hidden fees. What you see during booking is exactly what you pay.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="1" x2="12" y2="23" stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
          stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Easy Returns',
    desc: 'Schedule a free home pickup. No trips to the warehouse needed.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polyline points="1 4 1 10 7 10" stroke="#1E7BE2" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10"
          stroke="#1E7BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <section style={{
      background: 'linear-gradient(175deg, #0A1628 0%, #0F4C96 100%)',
      padding: '5rem 0',
    }}>
      <div className="container">

        {/* Header */}
        <div className="text-center mb-5">
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            color: '#5BA4F5',
          }}>
            Why MedRent
          </span>
          <h2 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 'clamp(1.5rem, 3vw, 1.9rem)',
            fontWeight: 800, color: '#FFFFFF',
            marginTop: '0.3rem',
          }}>
            Built Around Patient Needs
          </h2>
        </div>

        {/* Grid */}
        <div className="row g-4">
          {REASONS.map((r, i) => (
            <div key={r.title} className={`col-12 col-sm-6 col-lg-4 fade-up delay-${(i % 3) + 1}`}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 18,
                padding: '1.6rem',
                height: '100%',
                transition: 'background var(--transition)',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.09)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
              >
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 13,
                  background: 'rgba(91,164,245,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  {r.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '1rem', fontWeight: 700,
                  color: '#FFFFFF', marginBottom: '0.4rem',
                }}>
                  {r.title}
                </h3>
                <p style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.83rem', color: 'rgba(255,255,255,0.58)',
                  lineHeight: 1.65, marginBottom: 0,
                }}>
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}