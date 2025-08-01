// server/controllers/reportController.js
const Product = require('../models/Product');
const SalesOrder = require('../models/SalesOrder');

// @desc    Generate a low stock report
// @route   GET /api/reports/low-stock
// @access  Private (Admin, Inventory Manager)
const getLowStockReport = async (req, res) => {
  const lowStockProducts = await Product.find({ quantity: { $lte: '$reorderLevel' } });
  res.json(lowStockProducts);
};

// @desc    Generate a stock summary report
// @route   GET /api/reports/stock-summary
// @access  Private (Admin, Inventory Manager)
const getStockSummary = async (req, res) => {
  const summary = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$quantity' },
        totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
      },
    },
  ]);
  res.json(summary[0]); // Returns the single summary object
};

// @desc    Generate a sales report
// @route   GET /api/reports/sales
// @access  Private (Admin, Sales Staff)
const getSalesReport = async (req, res) => {
  const sales = await SalesOrder.find({}).populate('customer').populate('items.product');
  res.json(sales);
};

module.exports = {
  getLowStockReport,
  getStockSummary,
  getSalesReport,
};