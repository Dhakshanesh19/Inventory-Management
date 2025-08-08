// server/models/ActivityLog.js
const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema(
  {
    // User who performed the action
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Action details
    action: { type: String, required: true },
    entity: { type: String, required: true }, // 'product', 'order', 'user', etc.
    entityId: { type: mongoose.Schema.Types.ObjectId },
    
    // Action type
    actionType: { 
      type: String, 
      enum: ['create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import', 'approve', 'reject'],
      required: true 
    },
    
    // Changes made (for updates)
    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed,
      fields: [String] // which fields were changed
    },
    
    // Additional context
    description: String,
    notes: String,
    
    // IP and session information
    ipAddress: String,
    userAgent: String,
    sessionId: String,
    
    // Location information (if available)
    location: {
      country: String,
      city: String,
      timezone: String
    },
    
    // Status
    status: { 
      type: String, 
      enum: ['success', 'failure', 'pending'],
      default: 'success'
    },
    
    // Error information (if action failed)
    error: {
      message: String,
      code: String,
      stack: String
    },
    
    // Metadata
    metadata: mongoose.Schema.Types.Mixed,
    
    // Timestamps
    timestamp: { type: Date, default: Date.now }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for readable action description
activityLogSchema.virtual('actionDescription').get(function() {
  return `${this.actionType} ${this.entity}${this.entityId ? ` (${this.entityId})` : ''}`;
});

// Virtual for time ago
activityLogSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Indexes for better performance
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ entity: 1 });
activityLogSchema.index({ entityId: 1 });
activityLogSchema.index({ actionType: 1 });
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ status: 1 });
activityLogSchema.index({ ipAddress: 1 });

// TTL index to automatically delete old logs (keep for 1 year)
activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
module.exports = ActivityLog;
