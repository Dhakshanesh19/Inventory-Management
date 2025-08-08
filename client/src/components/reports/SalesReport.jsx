import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import Alert from '../common/Alert';
// Assuming you have an API utility for making requests
// import { getSalesByDateRange } from '../../api/api';

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      // Placeholder for an API call to get sales data
      // const response = await getSalesByDateRange(dateRange.startDate, dateRange.endDate);
      const mockData = [
        { _id: 'so-1', customerName: 'John Doe', totalAmount: 125.00, date: '2023-01-10' },
        { _id: 'so-2', customerName: 'Jane Smith', totalAmount: 350.50, date: '2023-01-12' },
      ];
      setSales(mockData);
      setError(null);
    } catch (err) {
      console.error('Error fetching sales report:', err);
      setError(err.message || 'Failed to fetch sales data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data on initial load
    fetchSalesData();
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchSalesData();
  };

  const columns = [
    { header: 'Order ID', accessor: '_id' },
    { header: 'Customer', accessor: 'customerName' },
    { header: 'Total Amount', accessor: 'totalAmount' },
    { header: 'Date', accessor: 'date' },
  ];

  if (loading) {
    return <div className="loading-state">Loading sales report...</div>;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="report-container">
      <h3 className="section-heading">Sales Report</h3>
      <form onSubmit={handleFilter} className="report-filter-form">
        <div className="form-group-inline">
          <label htmlFor="startDate">From:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="form-input-inline"
            value={dateRange.startDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="form-group-inline">
          <label htmlFor="endDate">To:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="form-input-inline"
            value={dateRange.endDate}
            onChange={handleDateChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Filter</button>
      </form>
      {sales.length > 0 ? (
        <Table columns={columns} data={sales} />
      ) : (
        <Alert type="info" message="No sales found for the selected date range." />
      )}
    </div>
  );
};

export default SalesReport;
