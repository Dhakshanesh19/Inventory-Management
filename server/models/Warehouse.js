// server/models/Warehouse.js
const mongoose = require('mongoose');

const warehouseSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: String,
    
    // Location details
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    
    // Contact information
    contact: {
      name: String,
      phone: String,
      email: String
    },
    
    // Warehouse manager
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Warehouse capacity and status
    capacity: {
      totalSpace: Number, // in square feet/meters
      usedSpace: Number,
      maxWeight: Number, // in kg
      currentWeight: Number
    },
    
    // Storage zones
    zones: [{
      name: String,
      code: String,
      description: String,
      temperature: Number, // for temperature-controlled zones
      humidity: Number, // for humidity-controlled zones
      isActive: { type: Boolean, default: true }
    }],
    
    // Operating hours
    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    
    // Status
    isActive: { type: Boolean, default: true },
    isPrimary: { type: Boolean, default: false }, // Primary warehouse
    
    // Special features
    features: [{
      type: String,
      enum: ['refrigeration', 'freezer', 'hazmat', 'highSecurity', 'bonded']
    }],
    
    // Notes
    notes: String
  },
  { timestamps: true }
);

// Virtual for available space
warehouseSchema.virtual('availableSpace').get(function() {
  return this.capacity.totalSpace - this.capacity.usedSpace;
});

// Virtual for space utilization percentage
warehouseSchema.virtual('spaceUtilization').get(function() {
  if (!this.capacity.totalSpace) return 0;
  return (this.capacity.usedSpace / this.capacity.totalSpace) * 100;
});

// Indexes
warehouseSchema.index({ code: 1 });
warehouseSchema.index({ isActive: 1 });
warehouseSchema.index({ isPrimary: 1 });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
module.exports = Warehouse;
