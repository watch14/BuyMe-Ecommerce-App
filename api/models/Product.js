const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productPicture: {
    type: [String],
    required: true
  },
  productColor: {
    type: String,
    default: "No Colors Option"
  },
  productDescription: {
    type: String,
    required: true
  },
  productRate: {
    type: Number,
    required: true
  },
  productStock: {
    type: Number,
    required: true
  },
  productDiscount: {
    type: Number,
  }
});

module.exports = mongoose.model('Product', productSchema);
