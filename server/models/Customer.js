// server/models/Customer.js
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;