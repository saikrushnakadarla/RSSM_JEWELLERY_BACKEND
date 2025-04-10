const express = require('express');
const oldItemsController = require('../controllers/OldItemsControllers');

const router = express.Router();

router.post('/olditems', oldItemsController.addProduct);
router.get('/get/olditems', oldItemsController.getAllProducts);
router.get('/get/olditems/:invoice_id', oldItemsController.getProductByInvoiceId); // New API

module.exports = router;
