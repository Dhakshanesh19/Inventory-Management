import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Table from '../components/common/Table';
import Alert from '../components/common/Alert';
import PurchaseOrderForm from '../components/purchases/PurchaseOrderForm';
import GRNForm from '../components/purchases/GRNForm';
// Assuming you have an API utility for purchase orders
// import { getPurchaseOrders } from '../../api/api'; 

const PurchaseManagementPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showGrnModal, setShowGrnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      // Placeholder for an API call to get all purchase orders
      // const data = await getPurchaseOrders();
      const mockData = [
          { 
            _id: 'po-101', 
            supplier: { name: 'Supplier A' }, 
            status: 'Pending', 
            total: 500.00, 
            date: new Date().toISOString() 
          },
          { 
            _id: 'po-102', 
            supplier: { name: 'Supplier B' }, 
            status: 'Received', 
            total: 750.00, 
            date: new Date().toISOString() 
          },
      ];
      setPurchaseOrders(mockData);
      setError(null);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      setError(err.message || 'Failed to fetch purchase orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const handleCreateOrder = () => {
    setShowOrderModal(true);
  };

  const handleProcessGRN = (order) => {
    setSelectedOrder(order);
    setShowGrnModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setShowGrnModal(false);
    setSelectedOrder(null);
  };

  const handleSaveOrder = () => {
    // Refresh the data after a successful save
    fetchPurchaseOrders();
  };

  const columns = [
    { header: 'Order ID', accessor: '_id' },
    { header: 'Supplier', accessor: 'supplier.name' },
    { header: 'Status', accessor: 'status' },
    { header: 'Total Amount', accessor: 'total' },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (row) => (
        <button className="btn btn-primary" onClick={() => handleProcessGRN(row)}>
          Process GRN
        </button>
      ) 
    },
  ];

  const dataWithActions = purchaseOrders.map(order => ({
    ...order,
    'supplier.name': order.supplier.name, // Flatten the object for table rendering
    actions: columns[4].render(order),
  }));

  if (loading) {
    return (
      <div className="app-layout">
        <Header />
        <Sidebar />
        <main className="content-area">
          <div className="loading-state">Loading purchase orders...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="content-area">
        <h2 className="page-heading">Purchase Order Management</h2>
        {error && <Alert type="error" message={error} />}

        <div className="action-bar">
          <button className="btn btn-primary" onClick={handleCreateOrder}>
            Create New Purchase Order
          </button>
        </div>

        {purchaseOrders.length > 0 ? (
          <Table columns={columns} data={dataWithActions} />
        ) : (
          <Alert type="info" message="No purchase orders found." />
        )}

        {showOrderModal && (
          <PurchaseOrderForm
            onClose={handleCloseModal}
            onCreate={handleSaveOrder}
          />
        )}
        
        {showGrnModal && (
          <GRNForm
            purchaseOrderId={selectedOrder._id}
            onClose={handleCloseModal}
            onProcess={handleSaveOrder}
          />
        )}
      </main>
    </div>
  );
};

export default PurchaseManagementPage;
