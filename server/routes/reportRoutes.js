// server/routes/reportRoutes.js
const express = require('express');
const { getLowStockReport, getStockSummary, getSalesReport } = require('../controllers/reportController');
const protect = require('../middleware/protect');
const authorize = require('../middleware/rbacMiddleware');
const router = express.Router();

router.route('/low-stock')
  .get(protect, authorize(['Admin', 'Inventory Manager']), getLowStockReport);

router.route('/stock-summary')
  .get(protect, authorize(['Admin', 'Inventory Manager']), getStockSummary);

router.route('/sales')
  .get(protect, authorize(['Admin', 'Sales Staff']), getSalesReport);

module.exports = router;