// server/controllers/salesController.js

const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// @desc    Get all sales orders
// @route   GET /api/sales
// @access  Private (All authenticated users)
const getSalesOrders = async (req, res) => {
  try {
    const orders = await SalesOrder.find({})
      .populate('customer')
      .populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales orders', error: error.message });
  }
};

// @desc    Create a new sales order
// @route   POST /api/sales
// @access  Private (Admin, Sales Staff)
const createSalesOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    // Stock check for each item
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }
    }

    // Create sales order
    const newOrder = new SalesOrder({ customer, items, totalAmount });
    const createdOrder = await newOrder.save();

    // Update stock and log transaction
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to create sales order', error: error.message });
  }
};

// @desc    Get a single sales order by ID
// @route   GET /api/sales/:id
// @access  Private (Admin, Sales Staff)
const getSalesOrderById = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id)
      .populate('customer')
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Sales order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales order', error: error.message });
  }
};

// @desc    Update a sales order
// @route   PUT /api/sales/:id
// @access  Private (Admin only)
const updateSalesOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await SalesOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Sales order not found' });
    }
    
    order.status = status || order.status;
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update sales order', error: error.message });
  }
};

// @desc    Delete a sales order
// @route   DELETE /api/sales/:id
// @access  Private (Admin only)
const deleteSalesOrder = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Sales order not found' });
    }
    
    await order.deleteOne();
    res.json({ message: 'Sales order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete sales order', error: error.message });
  }
};

module.exports = {
  getSalesOrders,
  createSalesOrder,
  getSalesOrderById,
  updateSalesOrder,
  deleteSalesOrder,
};
