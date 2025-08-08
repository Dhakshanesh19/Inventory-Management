import React, { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Table from '../components/common/Table';
import Alert from '../components/common/Alert';
import CustomerForm from '../components/customers/CustomerForm';
import { useCustomers } from '../context/CustomerContext';

const CustomersPage = () => {
  const { customers, fetchCustomers, loading, error } = useCustomers(); // ✅ error from context
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setShowCustomerModal(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleCloseModal = () => {
    setShowCustomerModal(false);
    setSelectedCustomer(null);
  };

  const handleSaveCustomer = () => {
    fetchCustomers(); // Refresh data after save
  };

  const columns = [
    { header: 'Customer Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button className="btn btn-secondary" onClick={() => handleEditCustomer(row)}>
          Edit
        </button>
      ),
    },
  ];

  const dataWithActions = customers.map((customer) => ({
    ...customer,
    actions: columns[3].render(customer),
  }));

  if (loading) {
    return (
      <div className="app-layout">
        <Header />
        <Sidebar />
        <main className="content-area">
          <div className="loading-state">Loading customers...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="content-area">
        <h2 className="page-heading">Customer Management</h2>
        {error && <Alert type="error" message={error} />}

        <div className="action-bar">
          <button className="btn btn-primary" onClick={handleAddCustomer}>
            Add New Customer
          </button>
        </div>

        {customers.length > 0 ? (
          <Table columns={columns} data={dataWithActions} />
        ) : (
          <Alert type="info" message="No customers found." />
        )}

        {showCustomerModal && (
          <CustomerForm
            customerData={selectedCustomer}
            onClose={handleCloseModal}
            onSave={handleSaveCustomer}
          />
        )}
      </main>
    </div>
  );
};

export default CustomersPage;
