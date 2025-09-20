import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  verified: {
    type: Boolean,
    default: false // True if user actually purchased/rented the product
  },
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpful: {
      type: Boolean,
      default: true
    }
  }],
  reported: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'fake', 'other'],
      required: true
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected', 'hidden'],
    default: 'active'
  },
  images: [{
    url: String,
    alt: String
  }]
}, {
  timestamps: true
});

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Index for efficient queries
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful ? this.helpful.filter(h => h.helpful).length : 0;
});

// Virtual for not helpful count
reviewSchema.virtual('notHelpfulCount').get(function() {
  return this.helpful ? this.helpful.filter(h => !h.helpful).length : 0;
});

// Include virtuals in JSON
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

// Pre-save middleware to verify purchase/rental
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Check if user has ordered this product
      const Order = mongoose.model('Order');
      const Booking = mongoose.model('Booking');
      
      const hasOrder = await Order.findOne({
        buyer: this.user,
        'products.product': this.product,
        status: { $in: ['delivered', 'completed'] }
      });
      
      const hasBooking = await Booking.findOne({
        renter: this.user,
        product: this.product,
        status: { $in: ['completed', 'confirmed'] }
      });
      
      this.verified = !!(hasOrder || hasBooking);
    } catch (error) {
      console.error('Error verifying purchase for review:', error);
    }
  }
  next();
});

// Static method to calculate product rating statistics
reviewSchema.statics.calculateProductRating = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: 'active'
      }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingBreakdown: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const { averageRating, totalReviews, ratingBreakdown } = stats[0];
  
  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingBreakdown.forEach(rating => {
    ratingDistribution[rating]++;
  });

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews,
    ratingDistribution
  };
};

// Static method to get review summary for product
reviewSchema.statics.getProductReviewSummary = async function(productId) {
  const reviews = await this.find({
    product: productId,
    status: 'active'
  })
  .populate('user', 'name')
  .sort({ createdAt: -1 })
  .limit(5);

  const stats = await this.calculateProductRating(productId);

  return {
    ...stats,
    recentReviews: reviews
  };
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;