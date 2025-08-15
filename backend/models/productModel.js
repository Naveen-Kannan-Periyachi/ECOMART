import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rentPricePerDay: {
      type: Number,
      required: function() {
        return this.type === 'rent';
      },
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Furniture', 'Fashion', 'Books', 'Sports', 'Others'],
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    },
    type: {
      type: String,
      required: true,
      enum: ['sell', 'rent', 'buy'],
    },
    images: [{
      type: String,
    }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented'],
      default: 'available',
    },
    views: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
