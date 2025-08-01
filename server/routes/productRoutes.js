// server/routes/productRoutes.js
const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize(['Admin', 'Inventory Manager']), createProduct);

router.route('/:id')
  .get(protect, getProductById)
  .put(protect, authorize(['Admin', 'Inventory Manager']), updateProduct)
  .delete(protect, authorize(['Admin']), deleteProduct);

module.exports = router;