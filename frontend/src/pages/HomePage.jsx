import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import HeroSection from '../components/home/HeroSection';
import StatsBar from '../components/home/StatsBar';
import FeaturedEquipment from '../components/home/FeaturedEquipment';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import HomeCTA from '../components/home/HomeCTA';

const recoveryKitImage =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80";

const healthAssistantImage =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80";
const iconStrokeProps = {
  stroke: '#1E7BE2',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function IconHomeHeart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 11l9-8 9 8" {...iconStrokeProps} />
      <path d="M5 10v10h14V10" {...iconStrokeProps} />
      <path d="M12 17s-3-1.8-3-4a2 2 0 013.5-1.3A2 2 0 0116 13c0 2.2-3 4-3 4z"
        fill="#1E7BE2" stroke="none" />
    </svg>
  );
}

function IconChecklist() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" {...iconStrokeProps} />
      <path d="M8 8h8M8 12l1.5 1.5L12.5 10M8 17h5" {...iconStrokeProps} />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const RECOVERY_CHIP_ICONS = {
  'Knee Surgery': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" {...iconStrokeProps} />
      <path d="M8 12h8M12 8v8" {...iconStrokeProps} />
    </svg>
  ),
  'Hip Surgery': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="7" r="3" {...iconStrokeProps} />
      <path d="M4 21v-3a4 4 0 014-4h2a4 4 0 014 4v3" {...iconStrokeProps} />
      <path d="M17 9l3 3-3 3" {...iconStrokeProps} />
    </svg>
  ),
  'Leg Fracture': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3v8l-2 10h4l2-8h4l2 8h4l-2-10V3" {...iconStrokeProps} />
    </svg>
  ),
  'Elderly Care': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="7" r="3.5" {...iconStrokeProps} />
      <path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5" {...iconStrokeProps} />
    </svg>
  ),
  'Respiratory Problems': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3v6a3 3 0 01-3 3 3 3 0 00-3 3v2a4 4 0 004 4c2 0 3-1.5 3-3v-4"
        {...iconStrokeProps} />
      <path d="M15 3v6a3 3 0 003 3 3 3 0 013 3v2a4 4 0 01-4 4c-2 0-3-1.5-3-3v-4"
        {...iconStrokeProps} />
    </svg>
  ),
  'Back Pain': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2v6M9 8l3 4-3 4M15 8l-3 4 3 4M12 16v6" {...iconStrokeProps} />
    </svg>
  ),
};

function Chip({ label }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="d-inline-flex align-items-center gap-2 rounded-pill border px-3 py-2 me-2 mb-2"
      style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: '0.8rem',
        fontWeight: 600,
        borderColor: 'var(--glass-border)',
        background: hovered ? 'var(--blue-500)' : 'var(--blue-50)',
        color: hovered ? '#fff' : 'var(--blue-700)',
        transition: 'var(--transition)',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {RECOVERY_CHIP_ICONS[label]}
      {label}
    </span>
  );
}

function ImageFrame({ src, alt }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="position-relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        aria-hidden="true"
        className="position-absolute"
        style={{
          top: -18,
          right: -18,
          width: '80%',
          height: '80%',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--blue-50) 0%, #DCEBFF 100%)',
          zIndex: 0,
        }}
      />
      <div
        className="position-relative overflow-hidden"
        style={{
          zIndex: 1,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          boxShadow: hovered
            ? '0 20px 48px rgba(15,76,150,0.18)'
            : '0 8px 28px rgba(15,76,150,0.10)',
          transition: 'var(--transition)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <img
          src={src}
          alt={alt}
          className="img-fluid w-100"
          style={{
            minHeight: 260,
            objectFit: 'cover',
            display: 'block',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const recoveryChips = [
    'Knee Surgery',
    'Hip Surgery',
    'Leg Fracture',
    'Elderly Care',
    'Respiratory Problems',
    'Back Pain',
  ];

  return (
    <main>
      <HeroSection />
      <StatsBar />
      <FeaturedEquipment />

      {/* Home Recovery Kit Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="glass-card p-4 p-lg-5 fade-up delay-1">
            <div className="row align-items-center g-5">
              <div className="col-12 col-lg-6 order-2 order-lg-1">
                <span
                  className="d-inline-flex align-items-center gap-2 mb-3"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: 'var(--blue-500)',
                  }}
                >
                  <IconHomeHeart />
                  Recovery At Home
                </span>

                <h2
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 'clamp(1.5rem, 3vw, 1.9rem)',
                    fontWeight: 800,
                    color: 'var(--blue-900)',
                    marginBottom: '0.9rem',
                  }}
                >
                  Home Recovery Kit
                </h2>

                <p
                  className="mb-4"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.95rem',
                    color: '#64748B',
                    lineHeight: 1.75,
                    maxWidth: 480,
                  }}
                >
                  Recovering from surgery or injury? Find the right medical
                  equipment for a safer and faster recovery.
                </p>

                <div className="mb-4 d-flex flex-wrap">
                  {recoveryChips.map((label) => (
                    <Chip key={label} label={label} />
                  ))}
                </div>

                <button
                  className="btn-medical-primary"
                  onClick={() => navigate('/recovery-kit')}
                >
                  Explore Recovery Kits
                  <IconArrowRight />
                </button>
              </div>

              <div className="col-12 col-lg-6 order-1 order-lg-2 fade-up delay-2">
                <ImageFrame
                  src={recoveryKitImage}
                  alt="Home recovery equipment set up in a comfortable home environment"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Assistant Section */}
      <section className="py-5" style={{ backgroundColor: '#F8FBFF' }}>
        <div className="container">
          <div className="glass-card p-4 p-lg-5 fade-up delay-1">
            <div className="row align-items-center g-5">
              <div className="col-12 col-lg-6">
                <span
                  className="d-inline-flex align-items-center gap-2 mb-3"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: 'var(--blue-500)',
                  }}
                >
                  <IconChecklist />
                  Guided Recommendations
                </span>

                <h2
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 'clamp(1.5rem, 3vw, 1.9rem)',
                    fontWeight: 800,
                    color: 'var(--blue-900)',
                    marginBottom: '0.9rem',
                  }}
                >
                  Health Assistant
                </h2>

                <p
                  className="mb-4"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.95rem',
                    color: '#64748B',
                    lineHeight: 1.75,
                    maxWidth: 480,
                  }}
                >
                  Not sure what equipment you need? Select your symptoms and
                  get instant, rule-based recommendations for the right
                  medical equipment to support your recovery.
                </p>

                <button
                  className="btn-medical-primary"
                  onClick={() => navigate('/health-assistant')}
                >
                  Try Health Assistant
                  <IconArrowRight />
                </button>
              </div>

              <div className="col-12 col-lg-6 fade-up delay-2">
                <ImageFrame
                  src={healthAssistantImage}
                  alt="Digital health assistant helping select the right medical equipment"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <WhyChooseUs />
      <HomeCTA />
    </main>
  );
}