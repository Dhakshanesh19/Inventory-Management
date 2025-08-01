// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    description: { type: String },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    reorderLevel: { type: Number, default: 10 },
    // For variants
    variants: [{ name: String, sku: String, quantity: Number, price: Number }],
    // For perishable items
    batch: [{ batchNumber: String, expiryDate: Date, quantity: Number }],
    // For serial numbers
    serialNumbers: [{ type: String }],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;