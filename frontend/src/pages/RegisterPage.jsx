import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [btnHover, setBtnHover] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const parseErrorMessage = (err) => {
    const data = err?.response?.data;
    const errors = data?.errors || data;

    if (!data) return err?.message || 'Registration failed. Please try again.';
    if (typeof data === 'string') return data;

if (errors.username) {
  return `Username: ${Array.isArray(errors.username) ? errors.username[0] : errors.username}`;
}

if (errors.email) {
  return `Email: ${Array.isArray(errors.email) ? errors.email[0] : errors.email}`;
}

if (errors.password) {
  return Array.isArray(errors.password) ? errors.password[0] : errors.password;
}

if (errors.non_field_errors) {
  return Array.isArray(errors.non_field_errors)
    ? errors.non_field_errors[0]
    : errors.non_field_errors;
}

if (errors.detail) return errors.detail;

    return err?.message || 'Registration failed. Please try again.';
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.password2
    ) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.password2) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await registerUser(formData);

      navigate('/login', {
        state: { success: 'Registration successful. Please login.' },
      });
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Styles (mirrors LoginPage) ───────────────────────────────────────────────
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f2',
    boxShadow: '0 6px 28px rgba(15,111,216,0.10)',
    padding: '2.25rem',
  };

  const getInputStyle = (fieldName) => ({
    borderRadius: '8px',
    border: focusedField === fieldName ? '1.5px solid #0f6fd8' : '1.5px solid #e2e8f2',
    padding: '0.65rem 1rem',
    fontSize: '0.9rem',
    backgroundColor: '#f4f7fc',
    transition: 'border-color 0.2s',
    outline: 'none',
    boxShadow: focusedField === fieldName ? '0 0 0 3px rgba(15,111,216,0.12)' : 'none',
  });

  const btnStyle = {
    backgroundColor: btnHover ? '#0c5cb3' : '#0f6fd8',
    border: 'none',
    borderRadius: '8px',
    padding: '0.7rem',
    fontWeight: 600,
    fontSize: '0.95rem',
    width: '100%',
    transition: 'background-color 0.2s, transform 0.2s',
    transform: btnHover ? 'translateY(-1px)' : 'translateY(0)',
  };

  const labelStyle = {
    fontSize: '0.875rem',
    color: '#1a2035',
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#f4f7fc', padding: '1.5rem 1rem' }}
    >
      <div style={{ width: '100%', maxWidth: '500px' }}>

        {/* Header */}
        <div className="text-center mb-3">
          <div
            style={{
              width: '56px', height: '56px',
              backgroundColor: '#eaf2ff',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 0.85rem',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#0f6fd8" />
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
            Create your account
          </h1>
          <p style={{ color: '#6b7a99', fontSize: '0.9rem' }}>
            Join MedRent to book medical equipment
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

            {/* First + Last name */}
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label htmlFor="first_name" className="form-label fw-semibold" style={labelStyle}>
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="form-control"
                  style={getInputStyle('first_name')}
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('first_name')}
                  onBlur={() => setFocusedField('')}
                  autoComplete="given-name"
                  autoFocus
                />
              </div>
              <div className="col-6">
                <label htmlFor="last_name" className="form-label fw-semibold" style={labelStyle}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="form-control"
                  style={getInputStyle('last_name')}
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('last_name')}
                  onBlur={() => setFocusedField('')}
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Username */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold" style={labelStyle}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                style={getInputStyle('username')}
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField('')}
                autoComplete="username"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold" style={labelStyle}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                style={getInputStyle('email')}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold" style={labelStyle}>
                Password
              </label>
              <div className="position-relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-control"
                  style={{ ...getInputStyle('password'), paddingRight: '1rem' }}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="password2" className="form-label fw-semibold" style={labelStyle}>
                Confirm Password
              </label>
              <div className="position-relative">
                <input
                  type={showPass2 ? 'text' : 'password'}
                  id="password2"
                  name="password2"
                  className="form-control"
                  style={{ ...getInputStyle('password2'), paddingRight: '1rem' }}
                  placeholder="Re-enter your password"
                  value={formData.password2}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password2')}
                  onBlur={() => setFocusedField('')}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              style={btnStyle}
              disabled={loading}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center mt-4 mb-0" style={{ fontSize: '0.875rem', color: '#6b7a99' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0f6fd8', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;