const express = require('express');
const router = express.Router();
const sortController = require('../controllers/sort.controller');

// Get all products with optional sorting and filtering
router.get('/', sortController.getAllProducts);

module.exports = router;
