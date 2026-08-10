import axiosInstance from "../api/axiosInstance";

export const getAllMedicines = () =>
  axiosInstance.get("/pharmacy/medicines/");

export const getMedicineById = (id) =>
  axiosInstance.get(`/pharmacy/medicines/${id}/`);

export const searchMedicines = (query) =>
  axiosInstance.get("/pharmacy/medicines/search/", {
    params: { q: query },
  });

export const createMedicine = (medicineData) =>
  axiosInstance.post("/pharmacy/medicines/", medicineData);

export const updateMedicine = (id, medicineData) =>
  axiosInstance.patch(`/pharmacy/medicines/${id}/`, medicineData);

export const deleteMedicine = (id) =>
  axiosInstance.delete(`/pharmacy/medicines/${id}/`);

// Kept for backward compatibility. No longer called from the
// "Place Order" button — order creation now happens only after
// successful payment, via createMedicinePayment().
export const placeMedicineOrder = (orderData) =>
  axiosInstance.post("/pharmacy/orders/", orderData);

export const createMedicinePayment = async (payload) => {
  try {
    const response = await axiosInstance.post("/pharmacy/payments/create/", payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      "Payment failed. Please try again."
    );
  }
};

export const getMyMedicineOrders = async () => {
  try {
    const response = await axiosInstance.get("/pharmacy/orders/my-orders/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      "Failed to load medicine orders. Please try again."
    );
  }
};

export const getMedicineOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(`/pharmacy/orders/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      "Failed to load order. Please try again."
    );
  }
};