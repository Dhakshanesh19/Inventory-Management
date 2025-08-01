const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }   // Added userId
});

module.exports = mongoose.model('Item', itemSchema);
