import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchEquipmentList } from '../services/equipmentService';
import EquipmentCard from '../components/EquipmentCard';
import EquipmentFilters   from '../components/equipment/EquipmentFilters';
import {
  EquipmentLoadingState,
  EquipmentErrorState,
  EquipmentEmptyState,
} from '../components/equipment/EquipmentStates';

const CATEGORY_OPTIONS = [
  { value: 'mobility_aids',     label: 'Mobility Aids' },
  { value: 'hospital_beds',     label: 'Hospital Beds' },
  { value: 'respiratory',       label: 'Respiratory Care' },
  { value: 'monitoring',        label: 'Monitoring Devices' },
  { value: 'first_aid',         label: 'First Aid' },
  { value: 'other',             label: 'Other' },
];

export default function EquipmentListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [category,    setCategory]    = useState(searchParams.get('category') || '');
  const [status,      setStatus]      = useState(searchParams.get('status') || '');

  const [equipment, setEquipment] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const loadEquipment = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);

      const query = {};
      if (params.search)   query.search   = params.search;
      if (params.category) query.category = params.category;
      if (params.status)   query.status   = params.status;

      const res  = await fetchEquipmentList(query);
      const data = res.data;
      const list = Array.isArray(data) ? data : (data?.results ?? []);
      setEquipment(list);
    } catch (err) {
      setError(err.message || 'Something went wrong while loading equipment.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = {
      search:   searchParams.get('search')   || '',
      category: searchParams.get('category') || '',
      status:   searchParams.get('status')    || '',
    };
    setSearchInput(params.search);
    setCategory(params.category);
    setStatus(params.status);
    loadEquipment(params);
  }, [searchParams, loadEquipment]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else   next.delete(k);
    });
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim() });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    updateParams({ category: e.target.value });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    updateParams({ status: e.target.value });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setCategory('');
    setStatus('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchParams.get('search') || searchParams.get('category') || searchParams.get('status')
  );

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 40%)',
        padding: '2.5rem 1rem 4rem',
      }}
    >
      <div className="container" style={{ maxWidth: 1180 }}>

        {/* ── Page header ── */}
        <div className="mb-4">
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#0F6FD8',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
            }}
          >
            Our Catalogue
          </span>
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(1.6rem, 4vw, 2.1rem)',
              fontWeight: 800,
              color: '#10243E',
              marginTop: '0.25rem',
              marginBottom: 0,
            }}
          >
            Browse Medical Equipment
          </h1>
          {!loading && !error && (
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.9rem',
                color: '#5C6B7A',
                marginTop: '0.35rem',
                marginBottom: 0,
              }}
            >
              {equipment.length} item{equipment.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* ── Filters ── */}
        <EquipmentFilters
          searchInput={searchInput}
          onSearchChange={(e) => setSearchInput(e.target.value)}
          onSearchSubmit={handleSearchSubmit}
          category={category}
          onCategoryChange={handleCategoryChange}
          categories={CATEGORY_OPTIONS}
          status={status}
          onStatusChange={handleStatusChange}
          onClear={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* ── States ── */}
        {loading && <EquipmentLoadingState />}

        {!loading && error && (
          <EquipmentErrorState
            message={error}
            onRetry={() => loadEquipment({ search: searchInput, category, status })}
          />
        )}

        {!loading && !error && equipment.length === 0 && (
          <EquipmentEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* ── Grid ── */}
        {!loading && !error && equipment.length > 0 && (
          <div className="row g-4">
            {equipment.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <EquipmentCard equipment={item} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}