const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');

// Add to favorite
router.post('/', favoriteController.addToFavorite);

module.exports = router;
