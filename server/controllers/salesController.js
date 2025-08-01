// server/controllers/salesController.js
const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// @desc    Get all sales orders
// @route   GET /api/sales
// @access  Private (All authenticated users)
const getSalesOrders = async (req, res) => {
  const orders = await SalesOrder.find({}).populate('customer').populate('items.product');
  res.json(orders);
};

// @desc    Create a new sales order
// @route   POST /api/sales
// @access  Private (Admin, Sales Staff)
const createSalesOrder = async (req, res) => {
  const { customer, items, totalAmount } = req.body;

  // Check if there is enough stock for each item
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.quantity < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
    }
  }

  const newOrder = new SalesOrder({ customer, items, totalAmount });
  const createdOrder = await newOrder.save();

  // Deduct stock and log transactions
  for (const item of createdOrder.items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { quantity: -item.quantity } },
      { new: true }
    );
    await Transaction.create({
      type: 'Sale',
      product: item.product,
      quantity: item.quantity,
      user: req.user._id,
      notes: `Sold via Sales Order #${createdOrder._id}`,
    });
  }

  res.status(201).json(createdOrder);
};

module.exports = {
  getSalesOrders,
  createSalesOrder,
};