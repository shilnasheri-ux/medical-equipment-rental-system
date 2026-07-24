import axiosInstance from '../api/axiosInstance';

export async function getMyBookings() {
  try {
    const response = await axiosInstance.get('bookings/my-bookings/');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Failed to load bookings. Please try again.'
    );
  }
}

export async function createBooking(payload) {
  try {
    const response = await axiosInstance.post('bookings/create/', payload);
    return response.data;
  } catch (error) {
    const data = error.response?.data;

    if (data?.errors && typeof data.errors === 'object') {
      const firstKey = Object.keys(data.errors)[0];
      const firstValue = data.errors[firstKey];
      const firstMessage = Array.isArray(firstValue) ? firstValue[0] : firstValue;
      if (firstMessage) {
        throw new Error(firstMessage);
      }
    }

    throw new Error(
      data?.detail ||
      data?.message ||
      data?.error ||
      'Failed to create booking. Please try again.'
    );
  }
}

export async function markNotificationRead(id) {
  return axiosInstance.patch(`bookings/${id}/mark-notification-read/`);
}

export async function getBookingById(id) {
  try {
    const response = await axiosInstance.get(`bookings/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Failed to load booking. Please try again.'
    );
  }
}

export async function createPayment(payload) {
  try {
    const response = await axiosInstance.post('payments/create/', payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      'Payment failed. Please try again.'
    );
  }
}

export async function requestReturn(bookingId) {
  try {
    const response = await axiosInstance.post(`bookings/${bookingId}/request-return/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      'Failed to submit return request. Please try again.'
    );
  }
}

export async function completeReturn(bookingId) {
  try {
    const response = await axiosInstance.post(`bookings/${bookingId}/complete-return/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      'Failed to complete return. Please try again.'
    );
  }
}