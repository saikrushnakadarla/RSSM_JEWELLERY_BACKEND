const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

// Routes for products
router.post('/add-product', productController.addProduct);
router.get('/products', productController.getProducts);

module.exports = router;
