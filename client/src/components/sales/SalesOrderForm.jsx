import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Alert from '../common/Alert';
import Table from '../common/Table';
import { useCustomers } from '../../context/CustomerContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { createSalesOrder } from '../../api/api'; // ✅ FIXED: Use direct API call

const SalesOrderForm = () => {
  const { customers, fetchCustomers } = useCustomers();
  const { products, fetchProducts } = useProducts();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customer: '',
    status: 'Pending',
  });

  const [orderItems, setOrderItems] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = e => {
    e.preventDefault();
    const product = e.target.product?.value;
    const quantity = parseInt(e.target.quantity?.value);

    if (!product || !quantity || quantity <= 0) {
      setError('Please select a product and enter a valid quantity.');
      return;
    }

    const selectedProduct = products.find(p => p._id === product);
    const existingItem = orderItems.find(item => item.product === product);

    if (existingItem) {
      setError('This product is already added. Update its quantity instead.');
      return;
    }

    setOrderItems(prev => [
      ...prev,
      {
        product,
        name: selectedProduct?.name,
        quantity,
        unitPrice: selectedProduct?.price || 0,
      },
    ]);

    e.target.reset();
    setError('');
  };

  const handleRemoveItem = index => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.customer) {
      setError('Please select a customer.');
      return;
    }

    if (orderItems.length === 0) {
      setError('Please add at least one product.');
      return;
    }

    const salesOrder = {
      ...formData,
      items: orderItems,
    };

    try {
      await createSalesOrder(salesOrder); // ✅ Corrected API call
      setSuccessMessage('Sales order created successfully!');
      setFormData({ customer: '', status: 'Pending' });
      setOrderItems([]);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to create sales order.');
    }
  };

  const itemColumns = [
    { label: 'Product', accessor: 'name' },
    { label: 'Quantity', accessor: 'quantity' },
    { label: 'Unit Price', accessor: 'unitPrice' },
    {
      label: 'Total',
      accessor: row => row.quantity * row.unitPrice,
    },
    {
      label: 'Actions',
      accessor: (_, index) => (
        <button className="btn btn-danger" onClick={() => handleRemoveItem(index)}>
          Remove
        </button>
      ),
    },
  ];

  const itemsWithActions = orderItems.map((item, index) => ({
    ...item,
    actions: itemColumns[4].accessor(item, index),
  }));

  return (
    <>
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="main-content">
          <h2>Create Sales Order</h2>

          {error && <Alert type="error" message={error} />}
          {successMessage && <Alert type="success" message={successMessage} />}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-section">
              <label>Customer</label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select a customer</option>
                {customers.map(cust => (
                  <option key={cust._id} value={cust._id}>
                    {cust.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-section">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-section">
              <h4>Order Items</h4>
              <form className="inline-form" onSubmit={handleAddItem}>
                <select name="product" className="form-input-inline" required>
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
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
                <button type="submit" className="btn btn-secondary">
                  Add Item
                </button>
              </form>

              {orderItems.length > 0 && (
                <Table columns={itemColumns} data={itemsWithActions} />
              )}
            </div>

            <div className="form-section">
              <button type="submit" className="btn btn-primary">
                Submit Sales Order
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default SalesOrderForm;
