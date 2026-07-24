// src/components/equipment/StatusBadge.jsx

import React from 'react';

const STATUS_CONFIG = {
  available: {
    label: 'Available',
    bg:    '#E8F7F0',
    color: '#0A8754',
    dot:   '#0A8754',
  },
  out_of_stock: {
    label: 'Out of Stock',
    bg:    '#FDEAEA',
    color: '#C92A2A',
    dot:   '#C92A2A',
  },
  under_maintenance: {
    label: 'Under Maintenance',
    bg:    '#FFF4E0',
    color: '#B5740A',
    dot:   '#B5740A',
  },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.out_of_stock;

  return (
    <span
      className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.2px',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: cfg.dot,
          display: 'inline-block',
        }}
      />
      {cfg.label}
    </span>
  );
}