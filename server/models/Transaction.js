// server/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    type: { type: String, enum: ['Purchase', 'Sale', 'Adjustment', 'Return'], required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;