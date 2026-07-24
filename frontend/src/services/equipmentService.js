import api from "../api/axiosInstance";

export const fetchEquipmentList = (params = {}) =>
  api.get("equipment/", { params });

export const fetchEquipmentById = (id) =>
  api.get(`equipment/${id}/`);

export const createEquipment = (data) =>
  api.post("equipment/", data);

export const updateEquipment = (id, data) =>
  api.patch(`equipment/${id}/`, data);

export const deleteEquipment = (id) =>
  api.delete(`equipment/${id}/`);

export default api;