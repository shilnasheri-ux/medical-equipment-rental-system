import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/paymentsuccesspage.css';

function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    mode = 'equipment',
    transactionId = '—',
    paymentMethod = '—',
    amount = null,
    paymentTime = null,
  } = location.state || {};

  const isMedicine = mode === 'medicine';

  const formattedPaymentTime = paymentTime
    ? new Date(paymentTime).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Today';

  return (
    <div className="ps-wrapper fade-in-up">
      <div className="container">
        <div className="ps-shell">

          <div className="ps-hero text-center">
            <div className="ps-success-circle pop-in">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <h1 className="ps-title mb-1">Payment Successful</h1>
            <p className="text-muted ps-subtitle mb-0">
              {isMedicine
                ? 'Medicine Order Placed Successfully.'
                : 'Your booking has been activated successfully.'}
            </p>
          </div>

          <div className="ps-body">

            <div className="ps-card mb-3">
              <h5 className="ps-card-title">
                <i className="bi bi-receipt text-primary me-2"></i>
                Transaction Details
              </h5>

              <div className="ps-row">
                <span className="ps-row-label">Transaction ID</span>
                <span className="ps-row-value ps-mono">{transactionId}</span>
              </div>

              <div className="ps-row">
                <span className="ps-row-label">Payment Method</span>
                <span className="ps-row-value">{paymentMethod}</span>
              </div>

              {amount != null && (
                <div className="ps-row">
                  <span className="ps-row-label">Amount Paid</span>
                  <span className="ps-amount-value">₹{Number(amount).toFixed(2)}</span>
                </div>
              )}

              <div className="ps-row">
                <span className="ps-row-label">{isMedicine ? 'Order Status' : 'Booking Status'}</span>
                <span className="badge rounded-pill ps-badge-active">
                  {isMedicine ? 'Confirmed' : 'Active'}
                </span>
              </div>

              <div className="ps-row ps-row-last">
                <span className="ps-row-label">Payment Date &amp; Time</span>
                <span className="ps-row-value">{formattedPaymentTime}</span>
              </div>
            </div>

            <div className="ps-secure-box mb-4">
              <i className="bi bi-shield-check ps-secure-icon"></i>
              <div>
                <p className="fw-semibold mb-0">
                  {isMedicine ? 'Medicine Order Placed Successfully' : 'Booking Activated'}
                </p>
                <p className="small mb-0">
                  {isMedicine
                    ? 'Your payment has been verified successfully. Your medicine order has been placed.'
                    : 'Your payment has been verified successfully. Your rental booking is now active.'}
                </p>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-2 ps-actions">
              <button
                className="btn ps-btn-primary rounded-pill fw-semibold"
                onClick={() => navigate("/my-bookings")}
              >
                <i className="bi bi-calendar2-check me-2"></i>
                {isMedicine ? "View My Orders" : "View My Bookings"}
              </button>
              <button
                className="btn ps-btn-outline rounded-pill fw-semibold"
                onClick={() => navigate('/')}
              >
                <i className="bi bi-house me-2"></i>
                Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;