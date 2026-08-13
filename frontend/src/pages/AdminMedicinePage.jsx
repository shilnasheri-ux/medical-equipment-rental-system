import React, { useEffect, useState } from 'react';
import {
  getAllMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from '../services/medicineService';

const CATEGORY_OPTIONS = [
  { value: 'pain_relief', label: 'Pain Relief' },
  { value: 'cold_and_flu', label: 'Cold & Flu' },
  { value: 'digestive_health', label: 'Digestive Health' },
  { value: 'vitamins', label: 'Vitamins & Supplements' },
  { value: 'first_aid', label: 'First Aid' },
  { value: 'skin_care', label: 'Skin Care' },
  { value: 'eye_and_ear', label: 'Eye & Ear Care' },
  { value: 'diabetes_care', label: 'Diabetes Care' },
  { value: 'allergy', label: 'Allergy Relief' },
  { value: 'other', label: 'Other' },
];

const EMPTY_FORM = {
  name: '',
  brand: '',
  category: 'other',
  price: '',
  stock_quantity: '',
  description: '',
  image: null,
};

function validateMedicineForm(formData) {
  if (!formData.name || !formData.category || formData.price === '' || formData.stock_quantity === '') {
    return 'Please fill in all required fields.';
  }
  if (Number(formData.price) < 0) {
    return 'Price cannot be negative.';
  }
  if (Number(formData.stock_quantity) < 0) {
    return 'Stock cannot be negative.';
  }
  return '';
}

function AdminMedicinePage() {
  const [medicines, setMedicines] = useState([]);
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

  const loadMedicines = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllMedicines();
      setMedicines(response.data?.medicines || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load medicines. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const filteredMedicines = medicines.filter((item) =>
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Add Medicine handlers ─────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (saving) return;
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

    const validationMessage = validateMedicineForm(formData);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('brand', formData.brand);
      payload.append('category', formData.category);
      payload.append('price', formData.price);
      payload.append('stock_quantity', formData.stock_quantity);
      payload.append('description', formData.description);
      if (formData.image) {
        payload.append('image', formData.image);
      }

      await createMedicine(payload);

      setShowAddModal(false);
      setFormData(EMPTY_FORM);
      setSuccessMessage('Medicine added successfully.');
      await loadMedicines();
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to add medicine. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Edit Medicine handlers ────────────────────────────────────────────────
  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setEditFormData({
      name: item.name || '',
      brand: item.brand || '',
      category: item.category || 'other',
      price: item.price ?? '',
      stock_quantity: item.stock_quantity ?? '',
      description: item.description || '',
      image: null,
    });
    setEditExistingImage(item.image || '');
    setEditFormError('');
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (editSaving) return;
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

    const validationMessage = validateMedicineForm(editFormData);
    if (validationMessage) {
      setEditFormError(validationMessage);
      return;
    }

    try {
      setEditSaving(true);

      const payload = new FormData();
      payload.append('name', editFormData.name);
      payload.append('brand', editFormData.brand);
      payload.append('category', editFormData.category);
      payload.append('price', editFormData.price);
      payload.append('stock_quantity', editFormData.stock_quantity);
      payload.append('description', editFormData.description);
      if (editFormData.image) {
        payload.append('image', editFormData.image);
      }

      await updateMedicine(editingId, payload);

      setShowEditModal(false);
      setEditingId(null);
      setEditFormData(EMPTY_FORM);
      setEditExistingImage('');
      setSuccessMessage('Medicine updated successfully.');
      await loadMedicines();
    } catch (err) {
      setEditFormError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update medicine. Please try again.'
      );
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete Medicine handler ───────────────────────────────────────────────
  const handleDelete = async (item) => {
    const confirmed = window.confirm('Are you sure you want to delete this medicine?');
    if (!confirmed) return;

    setError('');
    setDeletingId(item.id);

    try {
      await deleteMedicine(item.id);
      setMedicines((prev) => prev.filter((med) => med.id !== item.id));
      setSuccessMessage('Medicine deleted successfully.');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete medicine. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Medicine Management</h2>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
          + Add Medicine
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
          placeholder="Search medicines by name..."
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
      ) : filteredMedicines.length === 0 ? (
        <div className="alert alert-info">No medicines found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      <img
  src={`https://shilnasherin.pythonanywhere.com${item.image}`}
  alt={item.name}
  style={{
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '8px',
  }}
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
                  <td>{item.brand || '-'}</td>
                  <td>
                    {item.price != null ? `$${Number(item.price).toFixed(2)}` : '-'}
                  </td>
                  <td>{item.stock_quantity ?? '-'}</td>
                  <td>{item.stock_status_display || item.stock_status || '-'}</td>
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

      {/* Add Medicine Modal */}
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
                    <h5 className="modal-title">Add Medicine</h5>
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
                      <label htmlFor="med-name" className="form-label">Medicine Name</label>
                      <input
                        id="med-name"
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
                      <label htmlFor="med-category" className="form-label">Category</label>
                      <select
                        id="med-category"
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
                      <label htmlFor="med-brand" className="form-label">Manufacturer</label>
                      <input
                        id="med-brand"
                        type="text"
                        className="form-control"
                        name="brand"
                        value={formData.brand}
                        onChange={handleFormChange}
                        disabled={saving}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="med-price" className="form-label">Price</label>
                      <input
                        id="med-price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="med-stock" className="form-label">Stock</label>
                      <input
                        id="med-stock"
                        type="number"
                        min="0"
                        className="form-control"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleFormChange}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="med-description" className="form-label">Description</label>
                      <textarea
                        id="med-description"
                        className="form-control"
                        rows="3"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        disabled={saving}
                      />
                    </div>

                    <div className="mb-1">
                      <label htmlFor="med-image" className="form-label">Medicine Image</label>
                      <input
                        id="med-image"
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

      {/* Edit Medicine Modal */}
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
                    <h5 className="modal-title">Edit Medicine</h5>
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
                      <label htmlFor="edit-med-name" className="form-label">Medicine Name</label>
                      <input
                        id="edit-med-name"
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
                      <label htmlFor="edit-med-category" className="form-label">Category</label>
                      <select
                        id="edit-med-category"
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
                      <label htmlFor="edit-med-brand" className="form-label">Manufacturer</label>
                      <input
                        id="edit-med-brand"
                        type="text"
                        className="form-control"
                        name="brand"
                        value={editFormData.brand}
                        onChange={handleEditFormChange}
                        disabled={editSaving}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="edit-med-price" className="form-label">Price</label>
                      <input
                        id="edit-med-price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditFormChange}
                        disabled={editSaving}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="edit-med-stock" className="form-label">Stock</label>
                      <input
                        id="edit-med-stock"
                        type="number"
                        min="0"
                        className="form-control"
                        name="stock_quantity"
                        value={editFormData.stock_quantity}
                        onChange={handleEditFormChange}
                        disabled={editSaving}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="edit-med-description" className="form-label">Description</label>
                      <textarea
                        id="edit-med-description"
                        className="form-control"
                        rows="3"
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditFormChange}
                        disabled={editSaving}
                      />
                    </div>

                    <div className="mb-1">
                      <label htmlFor="edit-med-image" className="form-label">Medicine Image</label>

                      {editExistingImage && (
                        <div className="mb-2">
                          <img
                            src={
                              editExistingImage
                              ? `https://shilnasherin.pythonanywhere.com${editExistingImage}`
                              : ''
                            }
                            alt="Current medicine"
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div className="form-text">Current image. Upload a new file below to replace it.</div>
                        </div>
                      )}

                      <input
                        id="edit-med-image"
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

export default AdminMedicinePage;