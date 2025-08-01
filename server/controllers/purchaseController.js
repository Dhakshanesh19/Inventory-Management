// server/controllers/purchaseController.js
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// @desc    Get all purchase orders
// @route   GET /api/purchases
// @access  Private (All authenticated users)
const getPurchaseOrders = async (req, res) => {
  const orders = await PurchaseOrder.find({}).populate('supplier').populate('items.product');
  res.json(orders);
};

// @desc    Create a new purchase order
// @route   POST /api/purchases
// @access  Private (Admin, Purchase Staff)
const createPurchaseOrder = async (req, res) => {
  const { supplier, items, totalAmount } = req.body;
  const newOrder = new PurchaseOrder({ supplier, items, totalAmount });
  const createdOrder = await newOrder.save();
  res.status(201).json(createdOrder);
};

// @desc    Receive a purchase order (increase stock)
// @route   POST /api/purchases/:id/receive
// @access  Private (Admin, Purchase Staff)
const receivePurchaseOrder = async (req, res) => {
  const order = await PurchaseOrder.findById(req.params.id);

  if (order) {
    if (order.status === 'Received') {
      return res.status(400).json({ message: 'Order has already been received' });
    }
    
    // Update stock for each product in the order
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: item.quantity } },
        { new: true }
      );
      // Log the transaction
      await Transaction.create({
        type: 'Purchase',
        product: item.product,
        quantity: item.quantity,
        user: req.user._id,
        notes: `Received from Purchase Order #${order._id}`,
      });
    }

    order.status = 'Received';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Purchase Order not found' });
  }
};

module.exports = {
  getPurchaseOrders,
  createPurchaseOrder,
  receivePurchaseOrder,
};