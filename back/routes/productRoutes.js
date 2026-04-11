const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, getLowStockProducts, createProduct, updateProduct, updateProductPrice, deleteProduct } 
 = require('../controllers/productController');

router.get('/lowStock', getLowStockProducts);
router.get('/:id', getProductById);
router.get('/', getAllProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id/price', updateProductPrice);
router.delete('/:id', deleteProduct);

module.exports = router;