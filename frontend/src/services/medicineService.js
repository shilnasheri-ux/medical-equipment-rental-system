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

export const placeMedicineOrder = (orderData) =>
  axiosInstance.post("/pharmacy/orders/", orderData);