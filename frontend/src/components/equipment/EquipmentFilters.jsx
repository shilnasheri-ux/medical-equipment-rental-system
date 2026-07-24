// src/components/equipment/EquipmentFilters.jsx
import React from 'react';
import '../../styles/equipment.css';

/**
 * EquipmentFilters
 *
 * Purely presentational, controlled filter bar for the Equipment List page.
 * Holds NO internal state — every value and handler comes from
 * EquipmentListPage.jsx, matching its existing prop contract exactly.
 *
 * Props:
 *  - searchInput: string             current search input value
 *  - onSearchChange(event)           input onChange handler
 *  - onSearchSubmit(event)           form onSubmit handler (e.g. Enter key / search button)
 *  - category: string                current category value ('' = all)
 *  - onCategoryChange(event)         select onChange handler
 *  - categories: array               list of category options
 *  - status: string                  current status value ('' = all)
 *  - onStatusChange(event)           select onChange handler
 *  - onClear()                       clears all filters
 *  - hasActiveFilters: bool          whether any filter is currently active
 */

const STATUS_OPTIONS = [
  { value: '', label: 'All Availability' },
  { value: 'available', label: 'Available' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'under_maintenance', label: 'Under Maintenance' },
];

const SearchIcon = () => (
  <svg
    className="search-icon"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EquipmentFilters = ({
  searchInput = '',
  onSearchChange,
  onSearchSubmit,
  category = '',
  onCategoryChange,
  categories = [],
  status = '',
  onStatusChange,
  onClear,
  hasActiveFilters,
}) => {
  return (
    <div className="equipment-filters-panel">
      <form
        className="row g-3 align-items-center"
        onSubmit={onSearchSubmit}
        role="search"
      >
        {/* Search */}
        <div className="col-12 col-md-5">
          <div className="equipment-search-wrapper">
            <SearchIcon />
            <input
              type="text"
              className="form-control equipment-search-input"
              placeholder="Search equipment by name, model..."
              value={searchInput}
              onChange={onSearchChange}
              aria-label="Search equipment"
            />
          </div>
        </div>

        {/* Category */}
        <div className="col-6 col-md-3">
          <select
            className="form-select equipment-select"
            value={category}
            onChange={onCategoryChange}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => {
              const value = typeof cat === 'object' ? cat.id ?? cat.value : cat;
              const label = typeof cat === 'object' ? cat.name ?? cat.label : cat;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        {/* Availability / Status */}
        <div className="col-6 col-md-3">
          <select
            className="form-select equipment-select"
            value={status}
            onChange={onStatusChange}
            aria-label="Filter by availability"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear */}
        <div className="col-12 col-md-1 d-grid">
          <button
            type="button"
            className="btn equipment-clear-btn"
            onClick={onClear}
            disabled={!hasActiveFilters}
            title="Clear all filters"
          >
            ✕
          </button>
        </div>

        {/* Hidden submit so pressing Enter in the search box triggers onSearchSubmit */}
        <button type="submit" className="d-none" aria-hidden="true" tabIndex={-1} />
      </form>
    </div>
  );
};

export default EquipmentFilters;