import api from "../api/axiosInstance";

export const getAllBookings = () => {
  return api.get("bookings/admin/");
};

export const updateBookingStatus = (bookingId, status) => {
  return api.patch(`bookings/${bookingId}/status/`, {
    status,
  });
};


export const approveBooking = (bookingId) => {
  return updateBookingStatus(bookingId, "confirmed");
};

export const rejectBooking = (bookingId) => {
  return updateBookingStatus(bookingId, "cancelled");
};

export const getDashboardStats = () => {
  return api.get("dashboard/admin/");
};