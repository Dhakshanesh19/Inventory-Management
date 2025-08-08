// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Alert from '../components/common/Alert';
import LowStockAlerts from '../components/inventory/LowStockAlerts';
import SalesChart from '../components/dashboard/SalesChart';
import TopProducts from '../components/dashboard/TopProducts';
import { getDashboardSummary } from '../api/api';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalProducts: 0,
      lowStockCount: 0,
      todaySales: 0,
      todayOrders: 0
    },
    chartData: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardSummary();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content-area">
        <Header />
        <h2 className="page-heading">Dashboard</h2>

        {error && <Alert type="error" message={error} />}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <div className="summary-cards">
              <div className="card">
                <h4>Total Products</h4>
                <p className="card-metric">{dashboardData.summary.totalProducts}</p>
              </div>
              <div className="card">
                <h4>Today's Sales</h4>
                <p className="card-metric">₹{dashboardData.summary.todaySales.toFixed(2)}</p>
              </div>
              <div className="card">
                <h4>Today's Orders</h4>
                <p className="card-metric">{dashboardData.summary.todayOrders}</p>
              </div>
              <div className="card">
                <h4>Low Stock Items</h4>
                <p className="card-metric">{dashboardData.summary.lowStockCount}</p>
              </div>
            </div>

            <div className="dashboard-charts">
              <div className="chart-section">
                <SalesChart chartData={dashboardData.chartData} />
              </div>
              <div className="products-section">
                <TopProducts products={dashboardData.topProducts} />
              </div>
            </div>

            <div className="dashboard-section" style={{ marginTop: '2rem' }}>
              <LowStockAlerts />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;