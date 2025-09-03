import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'NEW_MESSAGE',      // New chat message received
      'PRODUCT_SOLD',     // Product was sold
      'PRODUCT_INQUIRY',  // Someone inquired about your product
      'ORDER_UPDATE',     // Order status changed
      'BOOKING_UPDATE',   // Booking status changed
      'REVIEW_RECEIVED',  // New review on your product
      'PAYMENT_RECEIVED', // Payment confirmed
      'PRICE_NEGOTIATION', // New price negotiation
      'NEGOTIATION_ACCEPTED', // Negotiation accepted
      'NEGOTIATION_REJECTED', // Negotiation rejected
      'NEGOTIATION_COUNTER',  // Counter offer made
      'SYSTEM_UPDATE'     // System announcements
    ]
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  data: {
    // Additional data like productId, chatId, orderId, etc.
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  actionUrl: {
    // URL to redirect when notification is clicked
    type: String,
    default: null
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  expiresAt: {
    type: Date,
    default: null,
    index: { expireAfterSeconds: 0 } // TTL index for auto-deletion
  }
}, {
  timestamps: true
});

// Indexes for performance
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return created.toLocaleDateString();
});

// Ensure virtual fields are serialized
notificationSchema.set('toJSON', { virtuals: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
