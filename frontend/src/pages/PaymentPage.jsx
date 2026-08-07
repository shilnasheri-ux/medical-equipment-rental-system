import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getBookingById, createPayment } from '../services/bookingService';
import { placeMedicineOrder } from '../services/medicineService';
import "../styles/paymentpage.css";

const PAYMENT_METHODS = [
  { key: 'upi', label: 'UPI' },
  { key: 'card', label: 'Card' },
  { key: 'cash', label: 'Cash' },
];

const METHOD_DISPLAY = {
  upi: { icon: 'bi-phone', name: 'UPI' },
  card: { icon: 'bi-credit-card-2-front', name: 'Debit/Credit Card' },
  cash: { icon: 'bi-cash-coin', name: 'Cash' },
};

function generateFallbackTransactionId() {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `TXN${randomDigits}`;
}

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isMedicineMode = location.state?.mode === 'medicine';

  const [booking, setBooking] = useState(null);
  const [medicineOrderData, setMedicineOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getBookingById(bookingId);
      setBooking(data.booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (isMedicineMode) {
      const {
        medicine_id,
        medicine_name,
        quantity,
        delivery_address,
        phone_number,
        total_amount,
      } = location.state || {};

      if (!medicine_id || !quantity || !delivery_address || !phone_number || total_amount == null) {
        setError('Missing order details. Please place your order again.');
        setLoading(false);
        return;
      }

      setMedicineOrderData({
        medicine_id,
        medicine_name,
        quantity,
        delivery_address,
        phone_number,
        total_amount,
      });
      setLoading(false);
      return;
    }

    loadBooking();
  }, [bookingId, isMedicineMode]);

  const methodLabel = (key) =>
    PAYMENT_METHODS.find((m) => m.key === key)?.label || key;

  const handlePayNow = () => {
    setProcessing(true);

    setTimeout(async () => {
      if (isMedicineMode) {
        try {
          const payload = {
            medicine: medicineOrderData.medicine_id,
            quantity: medicineOrderData.quantity,
            delivery_address: medicineOrderData.delivery_address,
            phone_number: medicineOrderData.phone_number,
          };

          const response = await placeMedicineOrder(payload);

          if (response.data.success) {
            toast.success(response.data.message || 'Payment successful.');

            navigate('/payment-success', {
              state: {
                mode: 'medicine',
                transactionId: generateFallbackTransactionId(),
                paymentMethod: methodLabel(selectedMethod),
                amount: response.data.order?.total_price ?? medicineOrderData.total_amount,
                paymentTime: new Date().toISOString(),
                medicineName: response.data.order?.medicine_name || medicineOrderData.medicine_name,
                orderId: response.data.order?.id,
              },
            });
          } else {
            toast.error(
              response.data.errors
                ? JSON.stringify(response.data.errors)
                : 'Failed to place order.'
            );
            setProcessing(false);
          }
        } catch (err) {
          toast.error(
            err.response?.data?.errors
              ? JSON.stringify(err.response.data.errors)
              : err.message || 'Payment failed. Please try again.'
          );
          setProcessing(false);
        }
        return;
      }

      try {
        const data = await createPayment({
          booking_id: booking.id,
          payment_method: selectedMethod,
        });

        toast.success(data.message || 'Payment successful.');

        navigate('/payment-success', {
          state: {
            mode: 'equipment',
            transactionId: data.payment?.transaction_id || generateFallbackTransactionId(),
            paymentMethod: methodLabel(selectedMethod),
            amount: data.payment?.amount || booking.total_price,
            paymentTime: data.payment?.paid_at || null,
          },
        });
      } catch (err) {
        toast.error(err.message || 'Payment failed. Please try again.');
        setProcessing(false);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="pp-wrapper">
        <div className="container">
          <div className="pp-shell d-flex flex-column align-items-center justify-content-center text-center py-5">
            <div className="spinner-border pp-spinner mb-3" role="status">
              <span className="visually-hidden">Loading</span>
            </div>
            <p className="text-muted mb-0">
              {isMedicineMode ? 'Loading order details…' : 'Loading booking details…'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pp-wrapper">
        <div className="container">
          <div className="pp-shell p-4 p-md-5">
            <div className="d-flex align-items-start gap-3 p-4 rounded-3 pp-error-box">
              <i className="bi bi-exclamation-triangle-fill fs-4 text-danger"></i>
              <div>
                <p className="fw-semibold text-danger mb-1">
                  {isMedicineMode ? 'Failed to load order details' : 'Failed to load booking'}
                </p>
                <p className="text-danger small mb-0">{error}</p>
              </div>
            </div>
            <Link
              to={isMedicineMode ? "/pharmacy" : "/my-bookings"}
              className="btn btn-outline-primary rounded-3 mt-4"
            >
              <i className="bi bi-arrow-left me-2"></i>
              {isMedicineMode ? 'Back to Pharmacy' : 'Back to My Bookings'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isMedicineMode && !booking) return null;
  if (isMedicineMode && !medicineOrderData) return null;

  if (!isMedicineMode && booking.status !== 'confirmed') {
    return (
      <div className="pp-wrapper">
        <div className="container">
          <div className="pp-shell text-center p-4 p-md-5">
            <div className="pp-icon-circle bg-danger-subtle text-danger mx-auto mb-3">
              <i className="bi bi-x-circle"></i>
            </div>
            <h5 className="fw-bold mb-2">This booking is not available for payment</h5>
            <p className="text-muted mb-4">
              Only bookings with a "Confirmed" status can be paid for. This booking is currently{' '}
              <strong>{booking.status_display || booking.status}</strong>.
            </p>
            <button
              className="btn btn-primary rounded-3 fw-semibold px-4 py-2 pp-btn-primary"
              onClick={() => navigate('/my-bookings')}
            >
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayAmount = isMedicineMode
    ? Number(medicineOrderData.total_amount)
    : Number(booking.total_price);

  return (
    <div className="pp-wrapper fade-in-up">
      <div className="container">
        <div className="pp-shell">

          <div className="pp-header px-3 px-md-4 pt-3 pb-2">
            <h1 className="pp-title mb-0">
              <i className="bi bi-shield-lock-fill text-primary me-2"></i>
              Secure Payment
            </h1>
            <p className="text-muted mb-0 pp-subtitle">
              {isMedicineMode
                ? 'Complete payment to confirm your medicine order.'
                : 'Complete payment to activate your booking.'}
            </p>
          </div>

          <div className="px-3 px-md-4 pb-3">

            <div className="row g-3">
              <div className="col-lg-7">
                <div className="pp-card h-100">
                  <h5 className="pp-card-title">
                    <i className="bi bi-file-earmark-text text-primary me-2"></i>
                    Payment Details
                  </h5>

                  {isMedicineMode ? (
                    <>
                      <div className="pp-row">
                        <span className="pp-row-label">Medicine Name</span>
                        <span className="pp-row-value">{medicineOrderData.medicine_name}</span>
                      </div>

                      <div className="pp-row">
                        <span className="pp-row-label">Quantity</span>
                        <span className="pp-row-value">{medicineOrderData.quantity}</span>
                      </div>

                      <div className="pp-row pp-row-last">
                        <span className="pp-row-label pp-amount-label">Amount</span>
                        <span className="pp-amount-inline">
                          ₹{displayAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pp-row">
                        <span className="pp-row-label">Equipment Name</span>
                        <span className="pp-row-value">{booking.equipment_name}</span>
                      </div>

                      <div className="pp-row">
                        <span className="pp-row-label">Rental Dates</span>
                        <span className="pp-row-value">
                          {booking.start_date} → {booking.end_date}
                        </span>
                      </div>

                      <div className="pp-row pp-row-last">
                        <span className="pp-row-label pp-amount-label">Amount</span>
                        <span className="pp-amount-inline">
                          ₹{displayAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-5">
                <div className="pp-card pp-summary-card h-100">
                  <h5 className="pp-card-title">
                    <i className="bi bi-receipt text-primary me-2"></i>
                    {isMedicineMode ? 'Order Summary' : 'Booking Summary'}
                  </h5>

                  {isMedicineMode ? (
                    <>
                      <div className="pp-summary-row">
                        <span><i className="bi bi-capsule me-2"></i>Medicine Name</span>
                        <span className="pp-summary-value">{medicineOrderData.medicine_name}</span>
                      </div>

                      <div className="pp-summary-row">
                        <span><i className="bi bi-boxes me-2"></i>Quantity</span>
                        <span className="pp-summary-value">{medicineOrderData.quantity}</span>
                      </div>

                      <div className="pp-summary-row">
                        <span><i className="bi bi-geo-alt me-2"></i>Delivery Address</span>
                        <span className="pp-summary-value">{medicineOrderData.delivery_address}</span>
                      </div>

                      <div className="pp-summary-row pp-summary-row-last">
                        <span><i className="bi bi-telephone me-2"></i>Phone Number</span>
                        <span className="pp-summary-value">{medicineOrderData.phone_number}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pp-summary-row">
                        <span><i className="bi bi-hospital me-2"></i>Equipment Name</span>
                        <span className="pp-summary-value">{booking.equipment_name}</span>
                      </div>

                      <div className="pp-summary-row">
                        <span><i className="bi bi-calendar-event me-2"></i>Rental Period</span>
                        <span className="pp-summary-value">
                          {booking.start_date} → {booking.end_date}
                        </span>
                      </div>

                      <div className="pp-summary-row pp-summary-row-last">
                        <span><i className="bi bi-cash-stack me-2"></i>Rental Charges</span>
                        <span className="pp-summary-value">
                          ₹{displayAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}

                  <hr className="pp-divider" />

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Total Amount</span>
                    <span className="pp-total-amount">
                      ₹{displayAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 mt-1">
              <div className="col-lg-7">
                <div className="pp-card h-100">
                  <h5 className="pp-card-title">
                    <i className="bi bi-wallet2 text-primary me-2"></i>
                    Select Payment Method
                  </h5>

                  <div className="row g-2">
                    {PAYMENT_METHODS.map((method) => {
                      const display = METHOD_DISPLAY[method.key] || { icon: 'bi-circle', name: method.label };
                      const isSelected = selectedMethod === method.key;
                      return (
                        <div className="col-4" key={method.key}>
                          <div
                            className={`pp-method-card${isSelected ? ' pp-method-card-selected' : ''}`}
                            onClick={() => setSelectedMethod(method.key)}
                            role="button"
                          >
                            {isSelected && (
                              <span className="pp-method-check">
                                <i className="bi bi-check-circle-fill"></i>
                              </span>
                            )}
                            <input
                              className="form-check-input visually-hidden"
                              type="radio"
                              name="paymentMethod"
                              id={method.key}
                              value={method.key}
                              checked={isSelected}
                              onChange={() => setSelectedMethod(method.key)}
                            />
                            <label htmlFor={method.key} className="pp-method-label">
                              <i className={`bi ${display.icon} pp-method-icon`}></i>
                              <span>{display.name}</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="pp-secure-box h-100">
                  <i className="bi bi-shield-check pp-secure-icon"></i>
                  <div>
                    <p className="fw-semibold mb-0">Safe &amp; Secure Payment</p>
                    <p className="small mb-0">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <button
                className="btn pp-btn-primary pp-pay-btn rounded-3 fw-semibold py-2"
                onClick={handlePayNow}
                disabled={processing}
              >
                {processing ? (
                  <span className="d-flex align-items-center justify-content-center gap-2">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    Processing Payment...
                  </span>
                ) : (
                  <span>
                    <i className="bi bi-lock-fill me-2"></i>
                    Pay Securely ₹{displayAmount.toFixed(2)}
                  </span>
                )}
              </button>

              <div className="mt-2">
                <button
                  className="btn btn-link pp-back-link"
                  onClick={() => navigate(isMedicineMode ? '/pharmacy' : '/my-bookings')}
                  disabled={processing}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  {isMedicineMode ? 'Back to Pharmacy' : 'Back to My Bookings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;