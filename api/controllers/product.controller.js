const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId');
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const productData = {
    productName: req.body.productName,
    categoryId: req.body.categoryId,
    productPrice: req.body.productPrice,
    productPicture: req.body.productPicture,
    productDescription: req.body.productDescription,
    productRate: req.body.productRate,
    productStock: req.body.productStock,
  };

  // Add optional fields if provided
  if (req.body.productColor) {
    productData.productColor = req.body.productColor;
  }
  if (req.body.productDiscount !== undefined) {
    productData.productDiscount = req.body.productDiscount;
  }

  const product = new Product(productData);

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('categoryId');
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
