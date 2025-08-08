// server/routes/supplierRoutes.js
const express = require('express');
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const protect = require('../middleware/protect');
const authorize = require('../middleware/rbacMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getSuppliers)
  .post(protect, authorize(['Admin', 'Purchase Staff']), createSupplier);

router.route('/:id')
  .put(protect, authorize(['Admin', 'Purchase Staff']), updateSupplier)
  .delete(protect, authorize(['Admin']), deleteSupplier);

module.exports = router;