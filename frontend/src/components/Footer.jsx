import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  const footerStyle = {
    backgroundColor: '#ffffff',
    borderTop: '1px solid var(--brand-border)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.875rem',
    color: 'var(--brand-muted)',
  };

  return (
    <footer style={footerStyle} className="py-4">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        <span>
          © {year}{' '}
          <Link to="/" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
            MedRent
          </Link>
          . All rights reserved.
        </span>
        <div className="d-flex gap-3">
          <Link to="/" style={{ color: 'var(--brand-muted)' }}>Home</Link>
          <Link to="/equipment" style={{ color: 'var(--brand-muted)' }}>Equipment</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;