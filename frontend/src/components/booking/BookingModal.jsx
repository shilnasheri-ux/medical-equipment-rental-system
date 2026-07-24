import React, { useState } from 'react';
import { createBooking } from '../../services/bookingService';

function BookingModal({ isOpen, onClose, equipmentId, equipmentName, onBookingSuccess }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setError(null);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return; // don't allow closing mid-request
    resetForm();
    onClose?.();
  };

  const validate = () => {
    if (!startDate || !endDate) {
      return 'Please select both start and end dates.';
    }
    if (startDate < todayStr) {
      return 'Start date cannot be in the past.';
    }
    if (endDate < startDate) {
      return 'End date cannot be before the start date.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      const booking = await createBooking({
        equipment_id: equipmentId,
        start_date: startDate,
        end_date: endDate,
      });
      resetForm();
      onBookingSuccess?.(booking);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop show"
        style={{ zIndex: 1040 }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="modal show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div
            className="modal-content rounded-3 border-0"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
          >
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div
                className="modal-header border-0 pb-0"
                style={{ paddingTop: '1.5rem', paddingInline: '1.5rem' }}
              >
                <div>
                  <h5
                    className="modal-title mb-1"
                    style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: 'var(--med-gray-700)' }}
                  >
                    Book Equipment
                  </h5>
                  {equipmentName && (
                    <p className="mb-0" style={{ fontSize: '0.85rem', color: 'var(--med-gray-500)' }}>
                      {equipmentName}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleClose}
                  disabled={submitting}
                />
              </div>

              {/* Body */}
              <div className="modal-body pt-3" style={{ paddingInline: '1.5rem' }}>
                {error && (
                  <div
                    className="alert alert-danger py-2 px-3 mb-3"
                    style={{ fontSize: '0.85rem' }}
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <div className="mb-3">
                  <label
                    htmlFor="booking-start-date"
                    className="form-label"
                    style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--med-gray-700)' }}
                  >
                    Start Date
                  </label>
                  <input
                    id="booking-start-date"
                    type="date"
                    className="form-control"
                    value={startDate}
                    min={todayStr}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="mb-1">
                  <label
                    htmlFor="booking-end-date"
                    className="form-label"
                    style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--med-gray-700)' }}
                  >
                    End Date
                  </label>
                  <input
                    id="booking-end-date"
                    type="date"
                    className="form-control"
                    value={endDate}
                    min={startDate || todayStr}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              {/* Footer */}
              <div
                className="modal-footer border-0 pt-2"
                style={{ paddingInline: '1.5rem', paddingBottom: '1.5rem' }}
              >
                <button
                  type="button"
                  className="btn rounded-3 fw-semibold"
                  style={{
                    border: '1.5px solid var(--med-blue-700)',
                    color: 'var(--med-blue-700)',
                    backgroundColor: 'transparent',
                    fontSize: '0.875rem',
                    padding: '0.55rem 1.25rem',
                  }}
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn rounded-3 fw-semibold"
                  style={{
                    backgroundColor: 'var(--med-blue-700)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.875rem',
                    padding: '0.55rem 1.5rem',
                  }}
                  disabled={submitting}
                >
                  {submitting ? 'Booking…' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingModal;