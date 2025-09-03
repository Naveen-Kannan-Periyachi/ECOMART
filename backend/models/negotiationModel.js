import mongoose from 'mongoose';

const negotiationSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  proposedPrice: {
    type: Number,
    required: true
  },
  counterOffers: [{
    offeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    message: {
      type: String,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COUNTER_OFFERED', 'EXPIRED'],
    default: 'PENDING'
  },
  buyerMessage: {
    type: String,
    maxlength: 500
  },
  sellerResponse: {
    type: String,
    maxlength: 500
  },
  finalPrice: {
    type: Number
  },
  acceptedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Negotiations expire after 7 days
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  },
  negotiationRound: {
    type: Number,
    default: 1
  },
  maxRounds: {
    type: Number,
    default: 5 // Maximum 5 rounds of negotiation
  }
}, {
  timestamps: true
});

// Index for efficient queries
negotiationSchema.index({ productId: 1, buyerId: 1 });
negotiationSchema.index({ sellerId: 1, status: 1 });
negotiationSchema.index({ status: 1, expiresAt: 1 });

// Auto-expire negotiations
negotiationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for negotiation progress
negotiationSchema.virtual('progressPercentage').get(function() {
  if (this.originalPrice === 0) return 0;
  const currentPrice = this.counterOffers.length > 0 
    ? this.counterOffers[this.counterOffers.length - 1].amount 
    : this.proposedPrice;
  return Math.round(((this.originalPrice - currentPrice) / this.originalPrice) * 100);
});

// Method to check if negotiation is still active
negotiationSchema.methods.isActive = function() {
  return this.status === 'PENDING' || this.status === 'COUNTER_OFFERED';
};

// Method to check if buyer can make counter offer
negotiationSchema.methods.canCounterOffer = function() {
  return this.isActive() && this.negotiationRound < this.maxRounds;
};

// Method to get latest offer
negotiationSchema.methods.getLatestOffer = function() {
  if (this.counterOffers.length > 0) {
    return this.counterOffers[this.counterOffers.length - 1];
  }
  return {
    amount: this.proposedPrice,
    offeredBy: this.buyerId,
    createdAt: this.createdAt
  };
};

const Negotiation = mongoose.model('Negotiation', negotiationSchema);

export default Negotiation;
