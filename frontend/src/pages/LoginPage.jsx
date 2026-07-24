// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';

function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await loginUser(formData);

      // Save tokens + user to context and localStorage
      login(data);

      if (data.user.is_staff) {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Styles ─────────────────────────────────────────────────────────────────
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f2',
    boxShadow: '0 4px 24px rgba(15,111,216,0.08)',
    padding: '2.5rem',
  };

  const inputStyle = {
    borderRadius: '8px',
    border: '1.5px solid #e2e8f2',
    padding: '0.65rem 1rem',
    fontSize: '0.9rem',
    backgroundColor: '#f4f7fc',
    transition: 'border-color 0.2s',
  };

  const btnStyle = {
    backgroundColor: '#0f6fd8',
    border: 'none',
    borderRadius: '8px',
    padding: '0.7rem',
    fontWeight: 600,
    fontSize: '0.95rem',
    width: '100%',
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#f4f7fc', padding: '2rem 1rem' }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div className="text-center mb-4">
          <div
            style={{
              width: '56px', height: '56px',
              backgroundColor: '#eaf2ff',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#0f6fd8"/>
              <path
                d="M5 14h4l2.5-6 3 11 2.5-8L19 14h4"
                stroke="#fff" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#1a2035',
              marginBottom: '0.25rem',
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: '#6b7a99', fontSize: '0.9rem' }}>
            Sign in to your MedRent account
          </p>
        </div>

        {/* Card */}
        <div style={cardStyle}>

          {/* Error alert */}
          {error && (
            <div
              className="alert mb-3 rounded-3 d-flex align-items-center gap-2 py-2 px-3"
              style={{ backgroundColor: '#fff5f5', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.875rem' }}
            >
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Username */}
            <div className="mb-3">
              <label
                htmlFor="username"
                className="form-label fw-semibold"
                style={{ fontSize: '0.875rem', color: '#1a2035' }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                style={inputStyle}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label
                  htmlFor="password"
                  className="form-label fw-semibold mb-0"
                  style={{ fontSize: '0.875rem', color: '#1a2035' }}
                >
                  Password
                </label>
              </div>
              <div className="position-relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-control"
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                {/* Show / hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: '#6b7a99', cursor: 'pointer', fontSize: '0.8rem',
                    padding: 0,
                  }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              style={btnStyle}
              disabled={loading}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center mt-4 mb-0" style={{ fontSize: '0.875rem', color: '#6b7a99' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#0f6fd8', fontWeight: 600 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;