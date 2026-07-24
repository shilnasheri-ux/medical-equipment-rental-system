import React, { useEffect, useState } from 'react';
import { fetchEquipmentList, createEquipment, updateEquipment, deleteEquipment } from '../services/equipmentService';

const CATEGORY_OPTIONS = [
  { value: 'mobility', label: 'Mobility Aids' },
  { value: 'respiratory', label: 'Respiratory Equipment' },
  { value: 'diagnostic', label: 'Diagnostic Tools' },
  { value: 'orthopedic', label: 'Orthopedic Supports' },
  { value: 'monitoring', label: 'Patient Monitoring' },
  { value: 'other', label: 'Other' },
];

const EMPTY_FORM = {
  name: '',
  category: 'mobility',
  price_per_day: '',
  stock: '',
  description: '',
  image: null,
};

function validateEquipmentForm(formData) {
  if (!formData.name || !formData.category || formData.price_per_day === '' || formData.stock === '') {
    return 'Please fill in all required fields.';
  }
  if (Number(formData.price_per_day) < 0) {
    return 'Price per day cannot be negative.';
  }
  if (Number(formData.stock) < 0) {
    return 'Stock cannot be negative.';
  }
  return '';
}

function AdminEquipmentPage() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(EMPTY_FORM);
  const [editExistingImage, setEditExistingImage] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editFormError, setEditFormError] = useState('');

  // Delete state
  const [deletingId, setDeletingId] = useState(null);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchEquipmentList();
      const list = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];
      setEquipmentList(list);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to load equipment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const filteredEquipment = equipmentList.filter((item) =>
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Add Equipment handlers ────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (saving) return; // don't allow closing mid-request
    setShowAddModal(false);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    const validationMessage = validateEquipmentForm(formData);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('category', formData.category);
      payload.append('price_per_day', formData.price_per_day);
      payload.append('stock', formData.stock);
      payload.append('description', formData.description);
      if (formData.image) {
        payload.append('image', formData.image);
      }

      await createEquipment(payload);

      setShowAddModal(false);
      setFormData(EMPTY_FORM);
      setSuccessMessage('Equipment added successfully.');
      await loadEquipment();
    } catch (err) {
      setFormError(
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to add equipment. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Edit Equipment handlers ───────────────────────────────────────────────
  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setEditFormData({
      name: item.name || '',
      category: item.category || 'mobility',
      price_per_day: item.price_per_day ?? '',
      stock: item.stock ?? '',
      description: item.description || '',
      image: null,
    });
    setEditExistingImage(item.image || '');
    setEditFormError('');
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (editSaving) return; // don't allow closing mid-request
    setShowEditModal(false);
    setEditingId(null);
    setEditFormData(EMPTY_FORM);
    setEditExistingImage('');
    setEditFormError('');
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setEditFormData((prev) => ({ ...prev, image: file }));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditFormError('');

    const validationMessage = validateEquipmentForm(editFormData);
    if (validationMessage) {
      setEditFormError(validationMessage);
      return;
    }

    try {
      setEditSaving(true);

      const payload = new FormData();
      payload.append('name', editFormData.name);
      payload.append('category', editFormData.category);
      payload.append('price_per_day', editFormData.price_per_day);
      payload.append('stock', editFormData.stock);
      payload.append('description', editFormData.description);
      if (editFormData.image) {
        payload.append('image', editFormData.image);
      }

      await updateEquipment(editingId, payload);

      setShowEditModal(false);
      setEditingId(null);
      setEditFormData(EMPTY_FORM);
      setEditExistingImage('');
      setSuccessMessage('Equipment updated successfully.');
      await loadEquipment();
    } catch (err) {
      setEditFormError(
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to update equipment. Please try again.'
      );
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete Equipment handler ──────────────────────────────────────────────
  const handleDelete = async (item) => {
    const confirmed = window.confirm('Are you sure you want to delete this equipment?');
    if (!confirmed) return;

    setError('');
    setDeletingId(item.id);

    try {
      await deleteEquipment(item.id);
      setEquipmentList((prev) => prev.filter((eq) => eq.id !== item.id));
      setSuccessMessage('Equipment deleted successfully.');
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to delete equipment. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Equipment Management</h2>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
          + Add Equipment
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search equipment by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredEquipment.length === 0 ? (
        <div className="alert alert-info">No equipment found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Equipment Name</th>
                <th>Category</th>
                <th>Price Per Day</th>
                <th>Stock</th>
                <th>Availability Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '8px',
                          backgroundColor: '#e9ecef',
                        }}
                      />
                    )}
                  </td>
                  <td>{item.name || '-'}</td>
                  <td>{item.category_display || item.category || '-'}</td>
                  <td>
                    {item.price_per_day != null
                      ? `$${Number(item.price_per_day).toFixed(2)}`
                      : '-'}
                  </td>
                  <td>{item.stock ?? '-'}</td>
                  <td>
                    {item.availability_status_display || item.availability_status || '-'}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleOpenEditModal(item)}
                        disabled={deletingId === item.id}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <>
          <div
            className="modal-backdrop show"
            style={{ zIndex: 1040 }}
            onClick={handleCloseAddModal}
          />
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <form onSubmit={handleSave}>
                  <div className="modal-header">
                    <h5 className="modal-title">Add Equipment</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={handleCloseAddModal}
                      disabled={saving}
                    />
                  </div>

                  <div className="modal-body">
                    {formError && (
                      <div className="alert alert-danger py-2 px-3" role="alert">
                        {formError}
                      </div>
                    )}

                    <div className="mb-3">
                      <label htmlFor="eq-name" className="form-label">Equipment Name</label>
                      <input
                        id="eq-name"
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="eq-category" className="form-label">Category</label>
                      <select
                        id="eq-category"
                        className="form-select"
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        disabled={saving}
                        required
                      >
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="eq-price" className="form-label">Price Per Day</label>
                      <input
                        id="eq-price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        name="price_per_day"
                        value={formData.price_per_day}
                        onChange={handleFormChange}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="eq-stock" className="form-label">Stock</label>
                      <input
                        id="eq-stock"
                        type="number"
                        min="0"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleFormChange}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="eq-description" className="form-label">Description</label>
                      <textarea
                        id="eq-description"
                        className="form-control"
                        rows="3"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        disabled={saving}
                      />
                    </div>

                    <div className="mb-1">
                      <label htmlFor="eq-image" className="form-label">Equipment Image</label>
                      <input
                        id="eq-image"
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleImageChange}
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseAddModal}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Equipment Modal */}
      {showEditModal && (
        <>
          <div
            className="modal-backdrop show"
            style={{ zIndex: 1040 }}
            onClick={handleCloseEditModal}
          />
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <form onSubmit={handleEditSave}>
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Equipment</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={handleCloseEditModal}
                      disabled={editSaving}
                    />
                  </div>

                  <div className="modal-body">
                    {editFormError && (
                      <div className="alert alert-danger py-2 px-3" role="alert">
                        {editFormError}
                      </div>
                    )}

                    <div className="mb-3">
                      <label htmlFor="edit-eq-name" className="form-label">Equipment Name</label>
                      <input
                        id="edit-eq-name"
                        type="text"
                        className="form-control"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        disabled={editSaving}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="edit-eq-category" className="form-label">Category</label>
                      <select
                        id="edit-eq-category"
                        className="form-select"
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditFormChange}
                        disabled={editSaving}
                        required
                      >
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="edit-eq-price" className="form-label">Price Per Day</label>
                      <input
                        id="edit-eq-price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        name="price_per_day"
                        value={editFormData.price_per_day}
                        onChange={handleEditFormChange}
                        disabled={editSaving}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="edit-eq-stock" className="form-label">Stock</label>
                      <input
                        id="edit-eq-stock"
                        type="number"
                        min="0"
                        className="form-control"
                        name="stock"
                        value={editFormData.stock}
                        onChange={handleEditFormChange}
                        disabled={editSaving}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="edit-eq-description" className="form-label">Description</label>
                      <textarea
                        id="edit-eq-description"
                        className="form-control"
                        rows="3"
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditFormChange}
                        disabled={editSaving}
                      />
                    </div>

                    <div className="mb-1">
                      <label htmlFor="edit-eq-image" className="form-label">Equipment Image</label>

                      {editExistingImage && (
                        <div className="mb-2">
                          <img
                            src={editExistingImage}
                            alt="Current equipment"
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div className="form-text">Current image. Upload a new file below to replace it.</div>
                        </div>
                      )}

                      <input
                        id="edit-eq-image"
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleEditImageChange}
                        disabled={editSaving}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseEditModal}
                      disabled={editSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={editSaving}
                    >
                      {editSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminEquipmentPage;