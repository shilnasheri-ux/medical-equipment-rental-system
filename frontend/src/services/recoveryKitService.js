import axiosInstance from "../api/axiosInstance";

export const getRecoveryKits = () =>
  axiosInstance.get("/recovery-kits/");