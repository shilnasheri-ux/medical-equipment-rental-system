// src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isLoggedIn, isStaff, user, logout } = useAuth();
  const navigate   = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Logout handler ─────────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();               // clears tokens and user from context + localStorage
    navigate('/login');     // send them to login page
  };

  // ── Styles ─────────────────────────────────────────────────────────────────
  const navStyle = {
    backgroundColor: '#ffffff',
    boxShadow: scrolled ? '0 2px 16px rgba(15,111,216,0.10)' : 'none',
    borderBottom: '1px solid #e2e8f2',
    transition: 'box-shadow 0.25s ease',
    fontFamily: "'DM Sans', sans-serif",
  };

  const brandStyle = {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: '1.2rem',
    color: '#0f6fd8',
  };

  const activeLinkStyle   = { color: '#0f6fd8', fontWeight: 600 };
  const defaultLinkStyle  = { color: '#1a2035', fontWeight: 400 };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={navStyle}>
      <div className="container">

        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#0f6fd8"/>
            <path
              d="M5 14h4l2.5-6 3 11 2.5-8L19 14h4"
              stroke="#fff" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <span style={brandStyle}>MedRent</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">

            {/* Always visible links */}
            <li className="nav-item">
              <NavLink
                to="/" end
                className="nav-link px-3 py-2 rounded-2"
                style={({ isActive }) => isActive ? activeLinkStyle : defaultLinkStyle}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/equipment"
                className="nav-link px-3 py-2 rounded-2"
                style={({ isActive }) => isActive ? activeLinkStyle : defaultLinkStyle}
              >
                Equipment
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/pharmacy"
                className="nav-link px-3 py-2 rounded-2"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : defaultLinkStyle
                }
              >
                Pharmacy
              </NavLink>
            </li>

            {/* ── Logged OUT: show Login + Register ── */}
            {!isLoggedIn && (
              <>
                <li className="nav-item ms-lg-2">
                  <NavLink
                    to="/login"
                    className="nav-link px-3 py-2 rounded-2"
                    style={({ isActive }) => isActive ? activeLinkStyle : defaultLinkStyle}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register">
                    {({ isActive }) => (
                      <span
                        className="btn btn-sm px-3 py-2 rounded-3 fw-semibold"
                        style={{
                          backgroundColor: isActive ? '#0a52a3' : '#0f6fd8',
                          color: '#fff',
                          border: 'none',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                        }}
                      >
                        Register
                      </span>
                    )}
                  </NavLink>
                </li>
              </>
            )}

            {/* ── Logged IN as ADMIN: show Admin Dashboard + Logout ── */}
            {isLoggedIn && isStaff && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/admin-dashboard"
                    className="nav-link px-3 py-2 rounded-2"
                    style={({ isActive }) => isActive ? activeLinkStyle : defaultLinkStyle}
                  >
                    Admin Dashboard
                  </NavLink>
                </li>

                <li className="nav-item ms-lg-2">
                  <button
                    className="btn btn-sm px-3 py-2 rounded-3 fw-semibold"
                    onClick={handleLogout}
                    style={{
                      backgroundColor: '#eaf2ff',
                      color: '#0f6fd8',
                      border: 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* ── Logged IN as NORMAL USER: show My Bookings + username dropdown ── */}
            {isLoggedIn && !isStaff && (
              <>
                {/* My Bookings link */}
                <li className="nav-item">
                  <NavLink
                    to="/my-bookings"
                    className="nav-link px-3 py-2 rounded-2"
                    style={({ isActive }) => isActive ? activeLinkStyle : defaultLinkStyle}
                  >
                    My Bookings
                  </NavLink>
                </li>

                {/* User dropdown */}
                <li className="nav-item dropdown ms-lg-2">
                  <button
                    className="btn btn-sm dropdown-toggle d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                    style={{
                      backgroundColor: '#eaf2ff',
                      color: '#0f6fd8',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {/* Avatar circle with first letter */}
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#0f6fd8',
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {user?.full_name?.charAt(0)?.toUpperCase() ||
                       user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    {user?.full_name || user?.username}
                  </button>

                  {/* Dropdown menu */}
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-1 rounded-3">

                    <li>
                      <Link
                        className="dropdown-item rounded-2 py-2"
                        to="/profile"
                        style={{ fontSize: '0.875rem' }}
                      >
                        My Profile
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item rounded-2 py-2"
                        to="/my-bookings"
                        style={{ fontSize: '0.875rem' }}
                      >
                        My Bookings
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item rounded-2 py-2"
                        to="/pharmacy"
                        style={{ fontSize: "0.875rem" }}
                      >
                        Pharmacy
                      </Link>
                    </li>

                    <li><hr className="dropdown-divider my-1" /></li>

                    <li>
                      <button
                        className="dropdown-item rounded-2 py-2 text-danger"
                        onClick={handleLogout}
                        style={{ fontSize: '0.875rem' }}
                      >
                        Logout
                      </button>
                    </li>

                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;