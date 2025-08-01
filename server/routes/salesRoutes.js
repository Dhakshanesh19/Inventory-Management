// server/routes/salesRoutes.js
const express = require('express');
const { getSalesOrders, createSalesOrder } = require('../controllers/salesController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getSalesOrders)
  .post(protect, authorize(['Admin', 'Sales Staff']), createSalesOrder);

module.exports = router;