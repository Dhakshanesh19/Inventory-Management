// server/routes/salesRoutes.js
const express = require('express');
const {
  createSalesOrder,
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrder,
  deleteSalesOrder,
} = require('../controllers/salesController');

const protect = require('../middleware/protect');
const authorize = require('../middleware/rbacMiddleware');

const router = express.Router();

// @route   GET /api/sales
// @desc    Get all sales orders
// @access  Admin, Sales Staff
router.get('/', protect, authorize(['Admin', 'Sales Staff']), getSalesOrders);

// @route   POST /api/sales
// @desc    Create a new sales order
// @access  Admin, Sales Staff
router.post('/', protect, authorize(['Admin', 'Sales Staff']), createSalesOrder);

// @route   GET /api/sales/:id
// @desc    Get a single sales order by ID
// @access  Admin, Sales Staff
router.get('/:id', protect, authorize(['Admin', 'Sales Staff']), getSalesOrderById);

// @route   PUT /api/sales/:id
// @desc    Update a sales order
// @access  Admin only
router.put('/:id', protect, authorize(['Admin']), updateSalesOrder);

// @route   DELETE /api/sales/:id
// @desc    Delete a sales order
// @access  Admin only
router.delete('/:id', protect, authorize(['Admin']), deleteSalesOrder);

module.exports = router;
