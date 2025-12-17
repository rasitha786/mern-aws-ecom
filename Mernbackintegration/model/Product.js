const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, default: 'electronics' },
  stock: { type: Number, default: 0 },
  brand: { type: String, default: 'Generic' }
}, {
  timestamps: true
});
module.exports = mongoose.model('Product', ProductSchema);
