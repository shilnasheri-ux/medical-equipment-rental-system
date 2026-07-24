import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#f4f7fc' }}
      >
        <div className="text-center">
          <p style={{ color: '#6b7a99', fontSize: '0.95rem', marginBottom: '1rem' }}>
            Unable to load profile. Please log in again.
          </p>
          <Link
            to="/login"
            className="btn btn-sm rounded-3 px-4"
            style={{
              backgroundColor: '#0f6fd8',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const fullName   = user.full_name?.trim() || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '—';
  const initials   = fullName !== '—'
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.username?.charAt(0).toUpperCase() || 'U';

  // ── Styles ─────────────────────────────────────────────────────────────────
  const pageStyle = {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f4f7fc',
    padding: '2.5rem 1rem',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f2',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(15, 111, 216, 0.08)',
    overflow: 'hidden',
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #0f6fd8 0%, #0a52a3 100%)',
    padding: '2rem',
    textAlign: 'center',
  };

  const avatarStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '3px solid rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#ffffff',
    fontFamily: "'Sora', sans-serif",
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.85rem 0',
    borderBottom: '1px solid #f1f5f9',
  };

  const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#6b7a99',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    minWidth: '130px',
  };

  const valueStyle = {
    fontSize: '0.95rem',
    color: '#1a2035',
    fontWeight: 500,
    textAlign: 'right',
  };

  return (
    <div style={pageStyle}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">

            {/* Page title */}
            <h1
              className="mb-4"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#1a2035',
              }}
            >
              My Profile
            </h1>

            {/* Profile card */}
            <div style={cardStyle}>

              {/* ── Card header: avatar + name ── */}
              <div style={headerStyle}>
                <div style={avatarStyle}>
                  {initials}
                </div>
                <h2
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '0.25rem',
                  }}
                >
                  {fullName}
                </h2>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.75)',
                    fontWeight: 400,
                  }}
                >
                  @{user.username}
                </span>
              </div>

              {/* ── Card body: profile fields ── */}
              <div style={{ padding: '0.5rem 1.75rem 1.5rem' }}>

                {/* Full Name */}
                <div style={rowStyle}>
                  <span style={labelStyle}>Full Name</span>
                  <span style={valueStyle}>{fullName}</span>
                </div>

                {/* Username */}
                <div style={rowStyle}>
                  <span style={labelStyle}>Username</span>
                  <span style={valueStyle}>@{user.username}</span>
                </div>

                {/* Email */}
                <div style={rowStyle}>
                  <span style={labelStyle}>Email</span>
                  <span style={{ ...valueStyle, wordBreak: 'break-all' }}>
                    {user.email || '—'}
                  </span>
                </div>

                {/* Staff status */}
                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                  <span style={labelStyle}>Account Type</span>
                  <span>
                    {user.is_staff ? (
                      <span
                        className="badge rounded-pill px-3 py-1"
                        style={{
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                        }}
                      >
                        Staff
                      </span>
                    ) : (
                      <span
                        className="badge rounded-pill px-3 py-1"
                        style={{
                          backgroundColor: '#eaf2ff',
                          color: '#1558b0',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                        }}
                      >
                        Member
                      </span>
                    )}
                  </span>
                </div>

              </div>
            </div>

            {/* Back link */}
            <div className="mt-3 text-center">
              <Link
                to="/"
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7a99',
                  textDecoration: 'none',
                }}
              >
                ← Back to Home
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;