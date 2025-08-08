// src/components/inventory/LowStockAlerts.jsx
import React, { useEffect, useState } from 'react';
import { getLowStockProducts } from '../../api/api';
import Table from '../common/Table';

const LowStockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'Current Stock', accessor: 'quantity' },
    { header: 'Reorder Level', accessor: 'reorderLevel' },
  ];

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const data = await getLowStockProducts();
        setLowStockProducts(data || []);
      } catch (err) {
        console.error('Error fetching low stock products:', err);
        setError('Failed to fetch low stock products');
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  if (loading) return <p>Loading low stock alerts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Low Stock Alerts</h2>
      {lowStockProducts.length > 0 ? (
        <Table columns={columns} data={lowStockProducts} />
      ) : (
        <p>No low stock products.</p>
      )}
    </div>
  );
};

export default LowStockAlerts;
