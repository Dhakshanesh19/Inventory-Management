// server/controllers/dashboardController.js
const Product = require('../models/Product');
const SalesOrder = require('../models/SalesOrder');
const PurchaseOrder = require('../models/PurchaseOrder');

// @desc    Get dashboard summary data
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    // Get total products
    const totalProducts = await Product.countDocuments();
    
    // Get low stock products count
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    });

    // Get today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySales = await SalesOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    // Get recent sales data for chart
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const salesData = await SalesOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get top selling products
    const topProducts = await Product.find({})
      .sort({ quantity: 1 })
      .limit(5)
      .select('name quantity price');

    res.json({
      summary: {
        totalProducts,
        lowStockCount,
        todaySales: todaySales[0]?.totalSales || 0,
        todayOrders: todaySales[0]?.orderCount || 0
      },
      chartData: salesData,
      topProducts
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

module.exports = {
  getDashboardSummary
};
