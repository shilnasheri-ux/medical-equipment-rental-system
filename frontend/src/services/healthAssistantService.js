import axiosInstance from "../api/axiosInstance";

export const analyzeSymptoms = (symptoms) =>
  axiosInstance.post("/health-assistant/analyze/", { symptoms });