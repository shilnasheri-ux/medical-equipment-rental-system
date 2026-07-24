import React, { useEffect, useState } from "react";
import { getAllMedicines } from "../services/medicineService";
import MedicineCard from "../components/MedicineCard";

const PharmacyPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAllMedicines();
        setMedicines(response.data.medicines);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            "Failed to load medicines. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">Pharmacy</h2>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && medicines.length === 0 && (
        <div className="alert alert-info">No medicines available.</div>
      )}

      {!loading && !error && medicines.length > 0 && (
        <div className="row g-4">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <MedicineCard medicine={medicine} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PharmacyPage;