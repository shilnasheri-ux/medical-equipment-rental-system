import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMedicineById } from "../services/medicineService";

const PLACEHOLDER_IMAGE =
  "https://dummyimage.com/400x300/e9ecef/6c757d&text=Medicine";

const formatPrice = (value) => {
  const num = Number(value);
  return Number.isNaN(num) ? "-" : `$${num.toFixed(2)}`;
};

const MedicineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getMedicineById(id);
        setMedicine(response.data.medicine);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            "Failed to load medicine details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  return (
    <div className="container mt-4 mb-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

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

      {!loading && !error && medicine && (
        <div className="card shadow-sm border-0">
          <div className="row g-0">
            <div className="col-md-5">
              <img
                src={
                    medicine.image
                        ? `https://shilnasherin.pythonanywhere.com${medicine.image}`
                        : PLACEHOLDER_IMAGE
                    }
                alt={medicine.name || "Medicine"}
                className="img-fluid rounded-start w-100 h-100"
                style={{ objectFit: "cover", minHeight: "320px" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>

            <div className="col-md-7">
              <div className="card-body">
                <h3 className="card-title mb-1">
                  {medicine.name || "Unnamed Medicine"}
                </h3>
                <span className="badge bg-light text-dark border mb-3">
                  {medicine.category || "Uncategorized"}
                </span>

                <div className="row mb-3">
                  <div className="col-6 mb-2">
                    <small className="text-muted d-block">Brand</small>
                    <span>{medicine.brand || "-"}</span>
                  </div>
                  <div className="col-6 mb-2">
                    <small className="text-muted d-block">Generic Name</small>
                    <span>{medicine.generic_name || "-"}</span>
                  </div>
                  <div className="col-6 mb-2">
                    <small className="text-muted d-block">Strength</small>
                    <span>{medicine.strength || "-"}</span>
                  </div>
                  <div className="col-6 mb-2">
                    <small className="text-muted d-block">Dosage Form</small>
                    <span>{medicine.dosage_form || "-"}</span>
                  </div>
                  <div className="col-6 mb-2">
                    <small className="text-muted d-block">Price</small>
                    <span className="fw-bold text-primary">
                      {formatPrice(medicine.price)}
                    </span>
                  </div>
                  <div className="col-6 mb-2">
                    <small className="text-muted d-block">Stock</small>
                    <span
                      className={
                        Number(medicine.stock_quantity) <= 0
                          ? "text-danger fw-bold"
                          : "text-success fw-bold"
                      }
                    >
                      {Number(medicine.stock_quantity) <= 0
                        ? "Out of Stock"
                        : `${medicine.stock_quantity} available`}
                    </span>
                  </div>
                  <div className="col-6 mb-2">
                    <small className="text-muted d-block">
                      Prescription Required
                    </small>
                    <span
                      className={`badge ${
                        medicine.requires_prescription
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {medicine.requires_prescription ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div>
                  <small className="text-muted d-block mb-1">
                    Description
                  </small>
                  <p className="mb-0">
                    {medicine.description || "No description available."}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/pharmacy/${medicine.id}/order`)}
                    disabled={Number(medicine.stock_quantity) <= 0}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineDetailPage;