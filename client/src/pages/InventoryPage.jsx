import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Alert from '../components/common/Alert';
import Table from '../components/common/Table';
import StockAdjustmentForm from '../components/inventory/StockAdjustmentForm';
import ProductForm from '../components/products/ProductForm';
import SearchFilterSort from '../components/ui/SearchFilterSort';
import { getProducts, getLowStockProducts, getExpiringProducts, exportInventory } from '../api/api'; 

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'low-stock', 'expiring'

  const fetchInventory = async (query = '') => {
    try {
      setLoading(true);
      const [productsData, lowStockData, expiringData] = await Promise.all([
        getProducts(),
        getLowStockProducts(),
        getExpiringProducts()
      ]);
      
      let filteredData = productsData;
      
      if (query) {
        filteredData = productsData.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.sku.toLowerCase().includes(query.toLowerCase()) ||
          product.barcode?.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      setInventory(filteredData);
      setLowStockProducts(lowStockData);
      setExpiringProducts(expiringData);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err.message || 'Failed to fetch inventory data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSearch = (query) => {
    fetchInventory(query);
  };

  const handleAdjustStock = (product) => {
    setSelectedProduct(product);
    setShowAdjustmentModal(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowAdjustmentModal(false);
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleSaveAdjustment = () => {
    fetchInventory();
  };

  const handleSaveProduct = () => {
    fetchInventory();
  };

  const handleExportInventory = async () => {
    try {
      const data = await exportInventory('csv');
      // Create and download file
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting inventory:', err);
      setError('Failed to export inventory data.');
    }
  };

  const getCurrentData = () => {
    switch (viewMode) {
      case 'low-stock':
        return lowStockProducts;
      case 'expiring':
        return expiringProducts;
      default:
        return inventory;
    }
  };

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Barcode', accessor: 'barcode' },
    { header: 'Current Stock', accessor: 'quantity' },
    { header: 'UOM', accessor: 'uom' },
    { header: 'Unit Price', accessor: 'price' },
    { header: 'Reorder Level', accessor: 'reorderLevel' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        let statusClass = 'status-success';
        let statusText = 'In Stock';
        
        if (row.quantity <= 0) {
          statusClass = 'status-critical';
          statusText = 'Out of Stock';
        } else if (row.quantity <= row.reorderLevel) {
          statusClass = 'status-warning';
          statusText = 'Low Stock';
        }
        
        if (row.expiringBatches && row.expiringBatches.length > 0) {
          statusClass = 'status-critical';
          statusText = 'Expiring Soon';
        }
        
        return (
          <span className={`status-badge ${statusClass}`}>
            {statusText}
          </span>
        );
      }
    },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (row) => (
        <div className="action-buttons">
          <button className="btn btn-secondary btn-sm" onClick={() => handleEditProduct(row)}>
            Edit
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => handleAdjustStock(row)}>
            Adjust
          </button>
        </div>
      ) 
    },
  ];

  const dataWithActions = getCurrentData().map(item => ({
    ...item,
    status: columns[7].render(item),
    actions: columns[8].render(item),
  }));

  if (loading) {
    return (
      <div className="app-layout">
        <Header />
        <Sidebar />
        <main className="content-area">
          <div className="loading-state">Loading inventory...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="content-area">
        <h2 className="page-heading">Inventory Management</h2>
        {error && <Alert type="error" message={error} />}

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="dashboard-card positive">
            <h3>Total Products</h3>
            <p className="value">{inventory.length}</p>
            <p className="change">Active inventory items</p>
          </div>
          <div className="dashboard-card warning">
            <h3>Low Stock Items</h3>
            <p className="value">{lowStockProducts.length}</p>
            <p className="change">Need reordering</p>
          </div>
          <div className="dashboard-card negative">
            <h3>Expiring Soon</h3>
            <p className="value">{expiringProducts.length}</p>
            <p className="change">Within 30 days</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Value</h3>
            <p className="value">${inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}</p>
            <p className="change">Current stock value</p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="view-mode-tabs">
          <button 
            className={`tab-button ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            All Products ({inventory.length})
          </button>
          <button 
            className={`tab-button ${viewMode === 'low-stock' ? 'active' : ''}`}
            onClick={() => setViewMode('low-stock')}
          >
            Low Stock ({lowStockProducts.length})
          </button>
          <button 
            className={`tab-button ${viewMode === 'expiring' ? 'active' : ''}`}
            onClick={() => setViewMode('expiring')}
          >
            Expiring Soon ({expiringProducts.length})
          </button>
        </div>

        <div className="action-bar">
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleAddProduct}>
              Add New Product
            </button>
            <button className="btn btn-secondary" onClick={handleExportInventory}>
              Export Inventory
            </button>
          </div>
          <SearchFilterSort onSearch={handleSearch} />
        </div>

        {getCurrentData().length > 0 ? (
          <Table columns={columns} data={dataWithActions} />
        ) : (
          <Alert type="info" message={`No ${viewMode === 'all' ? 'inventory' : viewMode.replace('-', ' ')} data found.`} />
        )}

        {showAdjustmentModal && (
          <StockAdjustmentForm
            product={selectedProduct}
            onClose={handleCloseModal}
            onAdjust={handleSaveAdjustment}
          />
        )}

        {showProductModal && (
          <ProductForm
            productData={selectedProduct}
            onClose={handleCloseModal}
            onSave={handleSaveProduct}
          />
        )}
      </main>
    </div>
  );
};

export default InventoryPage;
