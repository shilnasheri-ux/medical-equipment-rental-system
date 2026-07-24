// src/components/equipment/EquipmentStates.jsx
import React from 'react';
import '../../styles/equipment.css';

/**
 * EquipmentStates
 *
 * Exports three named components used by EquipmentListPage.jsx:
 *  - EquipmentLoadingState   (no props)
 *  - EquipmentErrorState     ({ message, onRetry })
 *  - EquipmentEmptyState     ({ hasActiveFilters, onClearFilters })
 */

/* ---------------------------------------------------------------- */
/* Loading State                                                      */
/* ---------------------------------------------------------------- */
export const EquipmentLoadingState = () => {
  return (
    <div>
      <div className="equipment-loading-wrap">
        <div className="equipment-spinner" role="status" aria-label="Loading equipment" />
        <p className="mb-0 fw-medium">Loading equipment...</p>
      </div>

      {/* Skeleton grid gives a preview of the layout while data loads */}
      <div className="row g-4 mt-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-12 col-sm-6 col-lg-4">
            <div className="equipment-skeleton-card" />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* Error State                                                        */
/* ---------------------------------------------------------------- */
const ErrorIcon = () => (
  <svg
    className="equipment-error-icon"
    width="52"
    height="52"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8v5M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EquipmentErrorState = ({ message, onRetry }) => {
  return (
    <div className="equipment-error-wrap">
      <ErrorIcon />
      <h3>Something went wrong</h3>
      <p>{message || 'We couldn\u2019t load the equipment list. Please try again.'}</p>
      <button type="button" className="btn equipment-retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* Empty State                                                        */
/* ---------------------------------------------------------------- */
const EmptyIcon = () => (
  <svg
    className="equipment-empty-icon"
    width="56"
    height="56"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M8 3v2m8-2v2M4 8h16M6 8v11a2 2 0 002 2h8a2 2 0 002-2V8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 13l6 6M15 13l-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EquipmentEmptyState = ({ hasActiveFilters, onClearFilters }) => {
  return (
    <div className="equipment-empty-wrap">
      <EmptyIcon />
      <h3>No equipment found</h3>
      <p>
        {hasActiveFilters
          ? 'No equipment matches your current search or filters.'
          : 'There is no equipment available right now.'}
      </p>
      {hasActiveFilters && (
        <button type="button" className="btn equipment-clear-btn mt-2" onClick={onClearFilters}>
          Clear Filters
        </button>
      )}
    </div>
  );
};