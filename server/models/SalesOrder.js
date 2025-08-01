// server/models/SalesOrder.js
const mongoose = require('mongoose');

const salesOrderSchema = mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    status: { type: String, enum: ['Pending', 'Dispatched', 'Delivered', 'Cancelled'], default: 'Pending' },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);
module.exports = SalesOrder;