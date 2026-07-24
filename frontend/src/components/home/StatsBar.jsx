// src/components/home/StatsBar.jsx

import React from 'react';

const STATS = [
  { value: '200+',  label: 'Equipment Items' },
  { value: '8,500', label: 'Patients Served' },
  { value: '4 hrs', label: 'Avg. Delivery Time' },
  { value: '99.2%', label: 'Satisfaction Rate' },
];

export default function StatsBar() {
  return (
    <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #EAF1FF' }}>
      <div className="container">
        <div className="row g-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="col-6 col-md-3 text-center py-4"
              style={{
                borderRight: i < STATS.length - 1 ? '1px solid #EAF1FF' : 'none',
              }}
            >
              <div style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 800,
                color: '#1E7BE2',
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.8rem',
                color: '#64748B',
                marginTop: 3,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}