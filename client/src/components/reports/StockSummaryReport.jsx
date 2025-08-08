import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import Alert from '../common/Alert';
// Assuming you have an API utility for making requests
// import { getProducts } from '../../api/api';

const StockSummaryReport = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockSummary = async () => {
      try {
        setLoading(true);
        // Placeholder for an API call to get all products
        // const response = await getProducts();
        const mockData = [
          { _id: '1', name: 'Laptop', sku: 'LAP-001', currentStock: 50, minStock: 10 },
          { _id: '2', name: 'Mouse', sku: 'MOU-001', currentStock: 250, minStock: 50 },
          { _id: '3', name: 'Keyboard', sku: 'KEY-001', currentStock: 5, minStock: 20 },
        ];
        setProducts(mockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching stock summary:', err);
        setError(err.message || 'Failed to fetch stock summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchStockSummary();
  }, []);

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Current Stock', accessor: 'currentStock' },
    { header: 'Minimum Stock', accessor: 'minStock' },
  ];

  if (loading) {
    return <div className="loading-state">Loading stock summary...</div>;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="report-container">
      <h3 className="section-heading">Stock Summary Report</h3>
      {products.length > 0 ? (
        <Table columns={columns} data={products} />
      ) : (
        <Alert type="info" message="No products found in the inventory." />
      )}
    </div>
  );
};

export default StockSummaryReport;
