import React, { useState } from 'react';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
// Assuming you have an API utility for making requests
// import { addSupplier, updateSupplier } from '../../api/api'; 

const SupplierForm = ({ supplierData = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: supplierData?.name || '',
    contactPerson: supplierData?.contactPerson || '',
    email: supplierData?.email || '',
    phone: supplierData?.phone || '',
    address: supplierData?.address || '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEditing = !!supplierData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic form validation
    if (!formData.name || !formData.email) {
      setError('Name and Email are required.');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        // Placeholder for an API call to update a supplier
        console.log('Updating supplier:', formData);
        // await updateSupplier(supplierData._id, formData);
      } else {
        // Placeholder for an API call to add a new supplier
        console.log('Adding new supplier:', formData);
        // await addSupplier(formData);
      }
      onSave(); // Call the parent component's save handler
      onClose();
    } catch (err) {
      console.error('Supplier form submission error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={true} title={isEditing ? 'Edit Supplier' : 'Add Supplier'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-container">
        {error && <Alert type="error" message={error} />}
        <div className="form-group">
          <label htmlFor="name">Supplier Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactPerson">Contact Person:</label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            className="form-input"
            value={formData.contactPerson}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            className="form-input"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Supplier')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SupplierForm;
