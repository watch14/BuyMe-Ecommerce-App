const Product = require('../models/Product');

// Get all products with optional sorting and filtering
exports.getAllProducts = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const category = req.query.category;

    let query = {};
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ [sortBy]: sortOrder });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
