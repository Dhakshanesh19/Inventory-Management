// server/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    // Transaction type
    type: { 
      type: String, 
      required: true,
      enum: ['purchase', 'sale', 'transfer', 'adjustment', 'return', 'damage', 'expiry', 'audit']
    },
    
    // Product and quantity details
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number },
    totalValue: { type: Number },
    
    // Location details
    fromWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    toWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    fromLocation: String, // Aisle-Shelf-Bin format
    toLocation: String,
    
    // Batch and serial number tracking
    batchNumber: String,
    serialNumbers: [String],
    
    // Reference documents
    referenceType: { 
      type: String, 
      enum: ['purchase_order', 'sales_order', 'transfer_order', 'adjustment', 'audit']
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    referenceNumber: String, // PO#, SO#, etc.
    
    // User and approval
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvalDate: { type: Date },
    
    // Transaction details
    notes: String,
    reason: String,
    
    // Status
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'completed'
    },
    
    // Costing information
    costingMethod: { 
      type: String, 
      enum: ['FIFO', 'LIFO', 'WeightedAverage'],
      default: 'WeightedAverage'
    },
    costPrice: { type: Number },
    
    // Timestamps
    transactionDate: { type: Date, default: Date.now },
    
    // Additional metadata
    metadata: {
      ipAddress: String,
      userAgent: String,
      sessionId: String
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for transaction value
transactionSchema.virtual('transactionValue').get(function() {
  return this.quantity * (this.unitPrice || 0);
});

// Virtual for transaction direction
transactionSchema.virtual('isInbound').get(function() {
  return ['purchase', 'return', 'transfer'].includes(this.type);
});

// Virtual for transaction direction
transactionSchema.virtual('isOutbound').get(function() {
  return ['sale', 'damage', 'expiry'].includes(this.type);
});

// Indexes for better performance
transactionSchema.index({ type: 1 });
transactionSchema.index({ product: 1 });
transactionSchema.index({ user: 1 });
transactionSchema.index({ transactionDate: -1 });
transactionSchema.index({ referenceType: 1, referenceId: 1 });
transactionSchema.index({ batchNumber: 1 });
transactionSchema.index({ 'serialNumbers': 1 });
transactionSchema.index({ fromWarehouse: 1 });
transactionSchema.index({ toWarehouse: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;