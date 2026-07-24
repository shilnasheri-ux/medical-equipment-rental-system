import React from "react";
import { Link } from "react-router-dom";

const PLACEHOLDER_IMAGE =
  "https://dummyimage.com/400x300/e9ecef/6c757d&text=Medicine";

const formatPrice = (value) => {
  const num = Number(value);
  return Number.isNaN(num) ? "-" : `₹${num.toFixed(2)}`;
};

const MedicineCard = ({ medicine }) => {
  console.log(medicine);
  const {
    id,
    name,
    category,
    price,
    stock_quantity,
    image,
  } = medicine || {};

  const isOutOfStock = Number(stock_quantity) <= 0;

  return (
    <div className="card h-100 shadow-sm border-0 medicine-card">
      <img
        src={
          image
            ? `http://127.0.0.1:8000${image}`
            : PLACEHOLDER_IMAGE
        }
        alt={name || "Medicine"}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_IMAGE;
        }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1 text-truncate" title={name}>
          {name || "Unnamed Medicine"}
        </h5>

        <span className="badge bg-light text-dark border mb-2 align-self-start">
          {category || "Uncategorized"}
        </span>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-primary fs-5">
            {formatPrice(price)}
          </span>
          <span
            className={`badge ${
              isOutOfStock ? "bg-danger" : "bg-success"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : `${stock_quantity} in stock`}
          </span>
        </div>

        <Link
          to={`/pharmacy/${id}`}
          className="btn btn-outline-primary mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MedicineCard;