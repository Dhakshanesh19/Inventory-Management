import React, { useState } from 'react';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
import { createCustomer, updateCustomer } from '../../api/api'; 

const CustomerForm = ({ customerData = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: customerData?.name || '',
    email: customerData?.email || '',
    phone: customerData?.phone || '',
    address: customerData?.address || '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEditing = !!customerData;

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
        await updateCustomer(customerData._id, formData);
      } else {
        await createCustomer(formData);
      }
      onSave(); // Call the parent component's save handler
      onClose();
    } catch (err) {
      console.error('Customer form submission error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={true} title={isEditing ? 'Edit Customer' : 'Add Customer'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-container">
        {error && <Alert type="error" message={error} />}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
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
            {loading ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Customer')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerForm;
