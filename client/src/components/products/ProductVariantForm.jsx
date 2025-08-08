import React, { useState } from 'react';
import Alert from '../common/Alert';
import Modal from '../common/Modal';

const ProductVariantForm = ({ product, variantData = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    variantName: variantData?.variantName || '',
    sku: variantData?.sku || '',
    price: variantData?.price || '',
    currentStock: variantData?.currentStock || 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEditing = !!variantData;

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

    if (!formData.variantName || !formData.sku) {
      setError('Variant Name and SKU are required.');
      setLoading(false);
      return;
    }

    try {
      // Placeholder for an API call to save a product variant
      console.log('Saving variant:', formData);
      // await saveProductVariant(product._id, formData);
      onSave();
      onClose();
    } catch (err) {
      console.error('Variant form submission error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={true} title={isEditing ? 'Edit Product Variant' : 'Add Product Variant'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-container">
        {error && <Alert type="error" message={error} />}
        <div className="form-group">
          <label htmlFor="variantName">Variant Name (e.g., "Red", "Large"):</label>
          <input
            type="text"
            id="variantName"
            name="variantName"
            className="form-input"
            value={formData.variantName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sku">Variant SKU:</label>
          <input
            type="text"
            id="sku"
            name="sku"
            className="form-input"
            value={formData.sku}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            className="form-input"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="currentStock">Current Stock:</label>
          <input
            type="number"
            id="currentStock"
            name="currentStock"
            className="form-input"
            value={formData.currentStock}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Variant'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductVariantForm;
