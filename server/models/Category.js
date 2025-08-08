// server/models/Category.js
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: String,
    
    // Parent category for hierarchical structure
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    
    // Category level in hierarchy
    level: { type: Number, default: 0 },
    
    // Category path for easy navigation
    path: [String],
    
    // Category image/icon
    image: String,
    icon: String,
    
    // Category settings
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    
    // Category-specific settings
    settings: {
      requiresSerialNumber: { type: Boolean, default: false },
      requiresBatchTracking: { type: Boolean, default: false },
      defaultUOM: { 
        type: String, 
        enum: ['pieces', 'kilograms', 'liters', 'meters', 'boxes', 'pairs', 'sets'],
        default: 'pieces'
      },
      defaultReorderLevel: { type: Number, default: 10 },
      defaultReorderQuantity: { type: Number, default: 50 }
    },
    
    // SEO fields
    seo: {
      title: String,
      description: String,
      keywords: [String]
    },
    
    // Sort order
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Virtual for child categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Indexes
categorySchema.index({ code: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
