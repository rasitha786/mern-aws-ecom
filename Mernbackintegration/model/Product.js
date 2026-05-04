const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'other'],
      default: 'electronics',
    },
    brand: { type: String, default: 'Generic' },
    stock: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);