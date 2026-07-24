// src/components/equipment/EquipmentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/equipment.css';

const DETAILS_ROUTE = (id) => `/equipment/${id}`;

const STATUS_LABELS = {
  available: 'Available',
  out_of_stock: 'Out of Stock',
  under_maintenance: 'Under Maintenance',
};

const PlaceholderIcon = () => (
  <svg
    className="placeholder-icon"
    width="56"
    height="56"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M8 3v2m8-2v2M4 8h16M6 8v11a2 2 0 002 2h8a2 2 0 002-2V8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 14h6M12 11v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EquipmentCard = ({ equipment }) => {
  if (!equipment) return null;

  const {
    id,
    name,
    category,
    description,
    price_per_day,
    availability_status,
    availability_status_display,
    image,
  } = equipment;

  const categoryLabel =
    typeof category === 'object' && category !== null ? category.name : category;

  const statusKey = availability_status || 'available';
  const statusLabel =
    availability_status_display || STATUS_LABELS[statusKey];

  return (
    <div className="equipment-card equipment-fade-in">
      <div className="equipment-card-media">
        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <PlaceholderIcon />
        )}
        <span className={`equipment-status-badge status-${statusKey}`}>
          {statusLabel}
        </span>
      </div>

      <div className="equipment-card-body">
        {categoryLabel && (
          <div className="equipment-card-category">{categoryLabel}</div>
        )}

        <h3 className="equipment-card-title">{name}</h3>

        {description && (
          <p className="equipment-card-desc">{description}</p>
        )}

        {price_per_day !== undefined && price_per_day !== null && (
          <div className="equipment-card-price">
            ₹{price_per_day} <small>/ day</small>
          </div>
        )}

        <Link
          to={DETAILS_ROUTE(id)}
          className="btn equipment-view-btn mt-auto w-100"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EquipmentCard;