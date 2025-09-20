import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      maxlength: 200
    }
  }]
}, {
  timestamps: true
});

// Compound index to ensure one wishlist per user
wishlistSchema.index({ user: 1 }, { unique: true });

// Index for efficient product lookups
wishlistSchema.index({ 'products.product': 1 });

// Virtual for product count
wishlistSchema.virtual('productCount').get(function() {
  return this.products ? this.products.length : 0;
});

// Include virtuals in JSON
wishlistSchema.set('toJSON', { virtuals: true });
wishlistSchema.set('toObject', { virtuals: true });

// Static method to get or create wishlist for user
wishlistSchema.statics.getOrCreateWishlist = async function(userId) {
  let wishlist = await this.findOne({ user: userId }).populate({
    path: 'products.product',
    select: 'title price images category type status averageRating reviewCount',
    populate: {
      path: 'owner',
      select: 'name'
    }
  });

  if (!wishlist) {
    wishlist = await this.create({ user: userId, products: [] });
    wishlist = await this.findById(wishlist._id).populate({
      path: 'products.product',
      select: 'title price images category type status averageRating reviewCount',
      populate: {
        path: 'owner',
        select: 'name'
      }
    });
  }

  return wishlist;
};

// Instance method to check if product is in wishlist
wishlistSchema.methods.hasProduct = function(productId) {
  return this.products.some(item => 
    item.product._id.toString() === productId.toString()
  );
};

// Instance method to add product to wishlist
wishlistSchema.methods.addProduct = function(productId, notes = '') {
  // Check if product already exists
  if (this.hasProduct(productId)) {
    throw new Error('Product already in wishlist');
  }

  this.products.unshift({
    product: productId,
    notes: notes.trim(),
    addedAt: new Date()
  });

  return this.save();
};

// Instance method to remove product from wishlist
wishlistSchema.methods.removeProduct = function(productId) {
  const initialLength = this.products.length;
  this.products = this.products.filter(item => 
    item.product._id.toString() !== productId.toString()
  );

  if (this.products.length === initialLength) {
    throw new Error('Product not found in wishlist');
  }

  return this.save();
};

// Instance method to update product notes
wishlistSchema.methods.updateProductNotes = function(productId, notes) {
  const productItem = this.products.find(item => 
    item.product._id.toString() === productId.toString()
  );

  if (!productItem) {
    throw new Error('Product not found in wishlist');
  }

  productItem.notes = notes.trim();
  return this.save();
};

// Instance method to clear all products
wishlistSchema.methods.clearWishlist = function() {
  this.products = [];
  return this.save();
};

// Instance method to get wishlist summary
wishlistSchema.methods.getSummary = function() {
  const categories = {};
  const types = {};
  let totalValue = 0;
  let availableCount = 0;

  this.products.forEach(item => {
    if (item.product) {
      // Count by category
      const category = item.product.category || 'Others';
      categories[category] = (categories[category] || 0) + 1;

      // Count by type
      const type = item.product.type || 'Unknown';
      types[type] = (types[type] || 0) + 1;

      // Calculate total value
      if (item.product.price) {
        totalValue += item.product.price;
      }

      // Count available products
      if (item.product.status === 'available') {
        availableCount++;
      }
    }
  });

  return {
    totalProducts: this.products.length,
    availableProducts: availableCount,
    totalValue,
    categories,
    types,
    lastUpdated: this.updatedAt
  };
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;