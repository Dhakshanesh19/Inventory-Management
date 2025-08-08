import React, { useState } from 'react';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
import Table from '../common/Table';
// Assuming you have an API utility for making requests
// import { createPurchaseOrder, getSuppliers, getProducts } from '../../api/api';

const PurchaseOrderForm = ({ onClose, onCreate }) => {
  const [supplierId, setSupplierId] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // In a real app, you would fetch suppliers and products here
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const suppliersData = await getSuppliers();
  //     const productsData = await getProducts();
  //     setSuppliers(suppliersData);
  //     setProducts(productsData);
  //   };
  //   fetchData();
  // }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    const productId = e.target.product.value;
    const quantity = parseInt(e.target.quantity.value, 10);
    const product = products.find(p => p._id === productId);

    if (product && quantity > 0) {
      setOrderItems(prevItems => [...prevItems, { productId, quantity, name: product.name, sku: product.sku }]);
      e.target.reset();
    }
  };

  const handleRemoveItem = (index) => {
    setOrderItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supplierId || orderItems.length === 0) {
      setError('Please select a supplier and add at least one item.');
      setLoading(false);
      return;
    }

    const newPurchaseOrder = {
      supplierId,
      items: orderItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
    };

    try {
      // Placeholder for an API call to create a purchase order
      console.log('Creating new purchase order:', newPurchaseOrder);
      // await createPurchaseOrder(newPurchaseOrder);
      onCreate();
      onClose();
    } catch (err) {
      console.error('Purchase order creation error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const itemColumns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Actions', accessor: 'actions' },
  ];

  const itemsWithActions = orderItems.map((item, index) => ({
    ...item,
    actions: <button onClick={() => handleRemoveItem(index)} className="btn btn-danger">Remove</button>,
  }));

  return (
    <Modal show={true} title="Create Purchase Order" onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-container">
        {error && <Alert type="error" message={error} />}
        <div className="form-group">
          <label htmlFor="supplier">Supplier:</label>
          <select
            id="supplier"
            className="form-input"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            required
          >
            <option value="">Select a supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <h4>Order Items</h4>
          <form onSubmit={handleAddItem} className="inline-form">
            <select name="product" className="form-input-inline" required>
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>{product.name}</option>
              ))}
            </select>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              className="form-input-inline"
              min="1"
              required
            />
            <button type="submit" className="btn btn-secondary">Add Item</button>
          </form>
          {orderItems.length > 0 && (
            <Table columns={itemColumns} data={itemsWithActions} />
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Purchase Order'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PurchaseOrderForm;
