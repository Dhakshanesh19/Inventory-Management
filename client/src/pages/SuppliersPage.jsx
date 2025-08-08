import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Alert from '../components/common/Alert';
import Table from '../components/common/Table';
import SupplierForm from '../components/suppliers/SupplierForm';
// Assuming you have an API utility for supplier data
// import { getSuppliers } from '../../api/api'; 

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      // Placeholder for an API call to get all suppliers
      // const data = await getSuppliers();
      const mockData = [
          { _id: '1', name: 'Supplier A', contactPerson: 'Joe Black', email: 'joe.b@supplierA.com' },
          { _id: '2', name: 'Supplier B', contactPerson: 'Jane Doe', email: 'jane.d@supplierB.com' },
      ];
      setSuppliers(mockData);
      setError(null);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(err.message || 'Failed to fetch suppliers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setShowSupplierModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierModal(true);
  };

  const handleCloseModal = () => {
    setShowSupplierModal(false);
    setSelectedSupplier(null);
  };

  const handleSaveSupplier = () => {
    // Refresh the data after a successful save
    fetchSuppliers();
  };

  const columns = [
    { header: 'Supplier Name', accessor: 'name' },
    { header: 'Contact Person', accessor: 'contactPerson' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (row) => (
        <button className="btn btn-secondary" onClick={() => handleEditSupplier(row)}>
          Edit
        </button>
      ) 
    },
  ];

  const dataWithActions = suppliers.map(supplier => ({
    ...supplier,
    actions: columns[3].render(supplier),
  }));

  if (loading) {
    return (
      <div className="app-layout">
        <Header />
        <Sidebar />
        <main className="content-area">
          <div className="loading-state">Loading suppliers...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="content-area">
        <h2 className="page-heading">Supplier Management</h2>
        {error && <Alert type="error" message={error} />}

        <div className="action-bar">
          <button className="btn btn-primary" onClick={handleAddSupplier}>
            Add New Supplier
          </button>
        </div>

        {suppliers.length > 0 ? (
          <Table columns={columns} data={dataWithActions} />
        ) : (
          <Alert type="info" message="No suppliers found." />
        )}

        {showSupplierModal && (
          <SupplierForm
            supplierData={selectedSupplier}
            onClose={handleCloseModal}
            onSave={handleSaveSupplier}
          />
        )}
      </main>
    </div>
  );
};

export default SuppliersPage;
