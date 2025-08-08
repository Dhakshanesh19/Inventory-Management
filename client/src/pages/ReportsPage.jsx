import React, { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import StockSummaryReport from '../components/reports/StockSummaryReport';
import SalesReport from '../components/reports/SalesReport';
import Alert from '../components/common/Alert';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('stock-summary'); // 'stock-summary' or 'sales-report'
  const [error, setError] = useState(null);

  const handleReportChange = (e) => {
    setReportType(e.target.value);
  };

  const renderReport = () => {
    switch (reportType) {
      case 'stock-summary':
        return <StockSummaryReport />;
      case 'sales-report':
        return <SalesReport />;
      default:
        return <Alert type="warning" message="Please select a report type." />;
    }
  };

  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="content-area">
        <h2 className="page-heading">Business Reports</h2>
        {error && <Alert type="error" message={error} />}

        <div className="report-selector-container">
          <label htmlFor="report-type">Select Report:</label>
          <select id="report-type" className="form-input-select" value={reportType} onChange={handleReportChange}>
            <option value="stock-summary">Stock Summary</option>
            <option value="sales-report">Sales Report</option>
          </select>
        </div>

        <div className="report-display-area">
          {renderReport()}
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
