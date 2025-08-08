// server/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    // Recipient
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Notification type
    type: { 
      type: String, 
      enum: ['low_stock', 'expiry_alert', 'reorder_reminder', 'system_alert', 'approval_required', 'order_status', 'inventory_audit'],
      required: true 
    },
    
    // Priority level
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    
    // Title and content
    title: { type: String, required: true },
    message: { type: String, required: true },
    
    // Related entity
    entity: { type: String }, // 'product', 'order', 'warehouse', etc.
    entityId: { type: mongoose.Schema.Types.ObjectId },
    
    // Action data
    action: {
      type: { type: String, enum: ['link', 'button', 'modal'] },
      label: String,
      url: String,
      data: mongoose.Schema.Types.Mixed
    },
    
    // Delivery channels
    channels: [{
      type: { type: String, enum: ['email', 'sms', 'push', 'in_app'] },
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    }],
    
    // Status
    status: { 
      type: String, 
      enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
      default: 'pending'
    },
    
    // Read status
    isRead: { type: Boolean, default: false },
    readAt: Date,
    
    // Scheduled delivery
    scheduledFor: Date,
    sentAt: Date,
    
    // Expiration
    expiresAt: Date,
    
    // Metadata
    metadata: {
      source: String, // which system/module generated this
      category: String,
      tags: [String]
    },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for notification age
notificationSchema.virtual('age').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return 'Just now';
});

// Virtual for urgency
notificationSchema.virtual('isUrgent').get(function() {
  return this.priority === 'critical' || this.priority === 'high';
});

// Virtual for expired
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

// Indexes for better performance
notificationSchema.index({ recipient: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ entity: 1, entityId: 1 });

// TTL index to automatically delete expired notifications (keep for 30 days)
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
