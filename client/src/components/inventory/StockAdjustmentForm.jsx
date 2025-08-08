// src/components/inventory/StockAdjustmentForm.jsx
import React, { useState } from 'react';

const StockAdjustmentForm = ({ product, onClose, onAdjust }) => {
  const [adjustment, setAdjustment] = useState({
    quantity: '',
    reason: '',
    type: 'add' // 'add' or 'subtract'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!adjustment.quantity || !adjustment.reason) {
      setError('Please fill in all fields');
      return;
    }

    const quantity = parseFloat(adjustment.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Calculate new quantity
      const newQuantity = adjustment.type === 'add' 
        ? product.quantity + quantity 
        : product.quantity - quantity;

      if (newQuantity < 0) {
        setError('Cannot reduce stock below 0');
        return;
      }

      // Here you would typically make an API call to update the product
      // For now, we'll just call the callback
      await onAdjust({
        productId: product._id,
        newQuantity,
        adjustment: adjustment.type === 'add' ? quantity : -quantity,
        reason: adjustment.reason
      });

      onClose();
    } catch (err) {
      setError('Failed to adjust stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdjustment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Adjust Stock - {product?.name}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          {error && <div className="alert alert-error">{error}</div>}
          
          <div className="form-group">
            <label>Current Stock: {product?.quantity}</label>
          </div>

          <div className="form-group">
            <label>Adjustment Type:</label>
            <select
              name="type"
              value={adjustment.type}
              onChange={handleChange}
              className="form-input"
            >
              <option value="add">Add Stock</option>
              <option value="subtract">Subtract Stock</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={adjustment.quantity}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter quantity"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Reason:</label>
            <textarea
              name="reason"
              value={adjustment.reason}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter reason for adjustment"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Adjusting...' : 'Adjust Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentForm;
