// server/routes/customerRoutes.js
const express = require('express');
const { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const protect = require('../middleware/protect');
const authorize = require('../middleware/rbacMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getCustomers)
  .post(protect, authorize(['Admin', 'Sales Staff']), createCustomer);

router.route('/:id')
  .get(protect, getCustomerById)
  .put(protect, authorize(['Admin', 'Sales Staff']), updateCustomer)
  .delete(protect, authorize(['Admin']), deleteCustomer);

module.exports = router;