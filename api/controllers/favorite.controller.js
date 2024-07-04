const Favorite = require('../models/Favorite');

// Add to favorite
exports.addToFavorite = async (req, res) => {
  const favorite = new Favorite({
    userId: req.body.userId,
    productId: req.body.productId,
  });

  try {
    const newFavorite = await favorite.save();
    res.status(201).json(newFavorite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
