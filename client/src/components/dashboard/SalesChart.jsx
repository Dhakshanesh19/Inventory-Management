// src/components/dashboard/SalesChart.jsx
import React from 'react';

const SalesChart = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="chart-container">
        <h3>Sales Trend (Last 7 Days)</h3>
        <div className="no-data">No sales data available</div>
      </div>
    );
  }

  const maxSales = Math.max(...chartData.map(item => item.totalSales));
  const chartHeight = 200;

  return (
    <div className="chart-container">
      <h3>Sales Trend (Last 7 Days)</h3>
      <div className="chart-wrapper">
        <div className="chart-bars">
          {chartData.map((item, index) => {
            const height = maxSales > 0 ? (item.totalSales / maxSales) * chartHeight : 0;
            return (
              <div key={index} className="chart-bar-group">
                <div 
                  className="chart-bar" 
                  style={{ height: `${height}px` }}
                  title={`${item._id}: ₹${item.totalSales.toFixed(2)}`}
                >
                  <span className="bar-value">₹{item.totalSales.toFixed(0)}</span>
                </div>
                <div className="bar-label">{new Date(item._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
