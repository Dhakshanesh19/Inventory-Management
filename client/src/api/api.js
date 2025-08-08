// src/api/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// -------------------- Auth APIs --------------------
export const loginUser = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/current-user');
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.get('/auth/logout');
  return res.data;
};

// -------------------- Products & Customers APIs --------------------
export const getLowStockProducts = async () => {
  const res = await api.get('/products/low-stock');
  return res.data;
};

export const getProducts = async () => {
  const res = await api.get('/products');
  return res.data;
};

export const getCustomers = async () => {
  const res = await api.get('/customers');
  return res.data;
};

export const createCustomer = async (customerData) => {
  const res = await api.post('/customers', customerData);
  return res.data;
};

export const updateCustomer = async (id, customerData) => {
  const res = await api.put(`/customers/${id}`, customerData);
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};

export const getSuppliers = async () => {
  const res = await api.get('/suppliers');
  return res.data;
};

export const createPurchaseOrder = async (order) => {
  const res = await api.post('/purchases', order);
  return res.data;
};

export const createSalesOrder = async (orderData) => {
  const res = await api.post('/sales', orderData);
  return res.data;
};

export const getDashboardSummary = async () => {
  const res = await api.get('/dashboard/summary');
  return res.data;
};

// Product Management APIs
export const createProduct = async (productData) => {
  const res = await api.post('/products', productData);
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const res = await api.put(`/products/${id}`, productData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// Category Management APIs
export const getCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};

export const createCategory = async (categoryData) => {
  const res = await api.post('/categories', categoryData);
  return res.data;
};

export const updateCategory = async (id, categoryData) => {
  const res = await api.put(`/categories/${id}`, categoryData);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

// Warehouse Management APIs
export const getWarehouses = async () => {
  const res = await api.get('/warehouses');
  return res.data;
};

export const createWarehouse = async (warehouseData) => {
  const res = await api.post('/warehouses', warehouseData);
  return res.data;
};

export const updateWarehouse = async (id, warehouseData) => {
  const res = await api.put(`/warehouses/${id}`, warehouseData);
  return res.data;
};

export const deleteWarehouse = async (id) => {
  const res = await api.delete(`/warehouses/${id}`);
  return res.data;
};

// Transaction APIs
export const getTransactions = async (filters = {}) => {
  const res = await api.get('/transactions', { params: filters });
  return res.data;
};

export const createTransaction = async (transactionData) => {
  const res = await api.post('/transactions', transactionData);
  return res.data;
};

// Activity Log APIs
export const getActivityLogs = async (filters = {}) => {
  const res = await api.get('/activity-logs', { params: filters });
  return res.data;
};

// Notification APIs
export const getNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};

// Advanced Inventory APIs

export const getExpiringProducts = async () => {
  const res = await api.get('/products/expiring');
  return res.data;
};

export const getStockMovements = async (filters = {}) => {
  const res = await api.get('/inventory/movements', { params: filters });
  return res.data;
};

export const adjustStock = async (productId, adjustmentData) => {
  const res = await api.post(`/products/${productId}/adjust-stock`, adjustmentData);
  return res.data;
};

export const transferStock = async (transferData) => {
  const res = await api.post('/inventory/transfer', transferData);
  return res.data;
};

// Barcode/QR Code APIs
export const generateBarcode = async (data) => {
  const res = await api.post('/barcode/generate', data);
  return res.data;
};

export const scanBarcode = async (barcode) => {
  const res = await api.post('/barcode/scan', { barcode });
  return res.data;
};

// Report APIs
export const getInventoryReport = async (filters = {}) => {
  const res = await api.get('/reports/inventory', { params: filters });
  return res.data;
};

export const getSalesReport = async (filters = {}) => {
  const res = await api.get('/reports/sales', { params: filters });
  return res.data;
};

export const getStockAgingReport = async (filters = {}) => {
  const res = await api.get('/reports/stock-aging', { params: filters });
  return res.data;
};

export const getDeadStockReport = async (filters = {}) => {
  const res = await api.get('/reports/dead-stock', { params: filters });
  return res.data;
};

// Export/Import APIs
export const exportInventory = async (format = 'csv', filters = {}) => {
  const res = await api.get(`/export/inventory/${format}`, { params: filters });
  return res.data;
};

export const importInventory = async (file, options = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  Object.keys(options).forEach(key => formData.append(key, options[key]));
  
  const res = await api.post('/import/inventory', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

// ✅ Export all functions here
export default {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  getLowStockProducts,
  getProducts,
  getCustomers,
  getSuppliers,
  createPurchaseOrder,
  createSalesOrder,
  getDashboardSummary,
};
