// server/routes/purchaseRoutes.js
const express = require('express');
const { getPurchaseOrders, createPurchaseOrder, receivePurchaseOrder } = require('../controllers/purchaseController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');
const router = express.Router();

// Route for getting all purchase orders and creating a new one
// Access is restricted to authenticated users
router.route('/')
  .get(protect, getPurchaseOrders)
  .post(protect, authorize(['Admin', 'Purchase Staff']), createPurchaseOrder);

// Route for receiving a specific purchase order and updating stock
// Access is restricted to Admin and Purchase Staff
router.route('/:id/receive')
  .post(protect, authorize(['Admin', 'Purchase Staff']), receivePurchaseOrder);

module.exports = router;