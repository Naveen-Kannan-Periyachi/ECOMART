import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    action: {
      type: String,
      enum: ['viewed', 'bought', 'rented', 'added_to_cart', 'searched'],
      required: true,
    },
    metadata: {
      // Additional data like search terms, time spent, etc.
      searchTerm: String,
      timeSpent: Number, // in seconds
      referrer: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ productId: 1, action: 1 });
activitySchema.index({ action: 1, createdAt: -1 });
activitySchema.index({ userId: 1, action: 1 });

// Compound index for user-specific queries
activitySchema.index({ userId: 1, productId: 1, action: 1 });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
