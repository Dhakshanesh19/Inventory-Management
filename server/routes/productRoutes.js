// server/routes/productRoutes.js
const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getExpiringProducts
} = require('../controllers/productController');
const protect = require('../middleware/protect');
const authorize = require('../middleware/rbacMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize(['Admin', 'Inventory Manager']), createProduct);

// ✅ Put specific routes before any `/:id`
router.get('/low-stock', protect, getLowStockProducts);
router.get('/expiring', protect, getExpiringProducts);

router.route('/:id')
  .get(protect, getProductById)
  .put(protect, authorize(['Admin', 'Inventory Manager']), updateProduct)
  .delete(protect, authorize(['Admin']), deleteProduct);

module.exports = router;
