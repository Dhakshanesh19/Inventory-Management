import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Alert from '../components/common/Alert';
import Table from '../components/common/Table';
import SalesOrderForm from '../components/sales/SalesOrderForm';
import Invoice from '../components/sales/Invoice';
// Assuming you have an API utility for sales data
// import { getSalesOrders } from '../../api/api'; 

const SalesManagementPage = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchSalesOrders = async () => {
    try {
      setLoading(true);
      // Placeholder for an API call to get all sales orders
      // const data = await getSalesOrders();
      const mockData = [
          { 
            _id: 'so-101', 
            customer: { name: 'Customer A' }, 
            status: 'Shipped', 
            total: 125.00, 
            date: new Date().toISOString() 
          },
          { 
            _id: 'so-102', 
            customer: { name: 'Customer B' }, 
            status: 'Pending', 
            total: 350.50, 
            date: new Date().toISOString() 
          },
      ];
      setSalesOrders(mockData);
      setError(null);
    } catch (err) {
      console.error('Error fetching sales orders:', err);
      setError(err.message || 'Failed to fetch sales orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  const handleCreateOrder = () => {
    setShowOrderModal(true);
  };

  const handleShowInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setShowInvoiceModal(false);
    setSelectedOrder(null);
  };

  const handleSaveOrder = () => {
    // Refresh the data after a successful save
    fetchSalesOrders();
  };

  const columns = [
    { header: 'Order ID', accessor: '_id' },
    { header: 'Customer', accessor: 'customer.name' },
    { header: 'Status', accessor: 'status' },
    { header: 'Total Amount', accessor: 'total' },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (row) => (
        <button className="btn btn-secondary" onClick={() => handleShowInvoice(row)}>
          View Invoice
        </button>
      ) 
    },
  ];

  const dataWithActions = salesOrders.map(order => ({
    ...order,
    'customer.name': order.customer.name, // Flatten the object for table rendering
    actions: columns[4].render(order),
  }));

  if (loading) {
    return (
      <div className="app-layout">
        <Header />
        <Sidebar />
        <main className="content-area">
          <div className="loading-state">Loading sales...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="content-area">
        <h2 className="page-heading">Sales Management</h2>
        {error && <Alert type="error" message={error} />}

        <div className="action-bar">
          <button className="btn btn-primary" onClick={handleCreateOrder}>
            Create New Sales Order
          </button>
        </div>

        {salesOrders.length > 0 ? (
          <Table columns={columns} data={dataWithActions} />
        ) : (
          <Alert type="info" message="No sales orders found." />
        )}

        {showOrderModal && (
          <SalesOrderForm
            onClose={handleCloseModal}
            onCreate={handleSaveOrder}
          />
        )}
        
        {showInvoiceModal && (
          <Invoice
            salesOrder={selectedOrder}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </div>
  );
};

export default SalesManagementPage;
