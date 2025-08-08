// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    barcode: { type: String, unique: true, sparse: true },
    qrCode: { type: String, unique: true, sparse: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    description: { type: String },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    reorderLevel: { type: Number, default: 10 },
    reorderQuantity: { type: Number, default: 50 },
    
    // Unit of Measure
    uom: { 
      type: String, 
      enum: ['pieces', 'kilograms', 'liters', 'meters', 'boxes', 'pairs', 'sets'],
      default: 'pieces'
    },
    
    // Location/Warehouse tracking
    locations: [{
      warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
      quantity: { type: Number, default: 0 },
      aisle: String,
      shelf: String,
      bin: String
    }],
    
    // For variants
    variants: [{ 
      name: String, 
      sku: String, 
      quantity: Number, 
      price: Number,
      barcode: String 
    }],
    
    // For perishable items - Batch tracking
    batches: [{
      batchNumber: { type: String, required: true },
      expiryDate: { type: Date, required: true },
      quantity: { type: Number, required: true },
      manufacturingDate: { type: Date },
      supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
      costPrice: { type: Number },
      status: { 
        type: String, 
        enum: ['active', 'expired', 'recalled'],
        default: 'active'
      }
    }],
    
    // For serial numbers - High value items
    serialNumbers: [{
      serialNumber: { type: String, required: true, unique: true },
      status: { 
        type: String, 
        enum: ['available', 'sold', 'reserved', 'defective'],
        default: 'available'
      },
      purchaseDate: { type: Date },
      warrantyExpiry: { type: Date },
      notes: String
    }],
    
    // Product specifications
    specifications: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number
      },
      color: String,
      material: String,
      brand: String,
      model: String
    },
    
    // Status and flags
    isActive: { type: Boolean, default: true },
    isPerishable: { type: Boolean, default: false },
    requiresSerialNumber: { type: Boolean, default: false },
    requiresBatchTracking: { type: Boolean, default: false },
    
    // Images
    images: [String],
    
    // Tags for categorization
    tags: [String],
    
    // Audit fields
    lastStockCheck: { type: Date },
    lastPurchaseDate: { type: Date },
    lastSaleDate: { type: Date },
    
    // Costing method
    costingMethod: { 
      type: String, 
      enum: ['FIFO', 'LIFO', 'WeightedAverage'],
      default: 'WeightedAverage'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total value
productSchema.virtual('totalValue').get(function() {
  return this.quantity * this.price;
});

// Virtual for low stock status
productSchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.reorderLevel;
});

// Virtual for expiry alerts
productSchema.virtual('expiringBatches').get(function() {
  if (!this.batches) return [];
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  return this.batches.filter(batch => 
    batch.status === 'active' && 
    batch.expiryDate <= thirtyDaysFromNow &&
    batch.quantity > 0
  );
});

// Indexes for better performance
productSchema.index({ sku: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ category: 1 });
productSchema.index({ supplier: 1 });
productSchema.index({ 'batches.expiryDate': 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;