const express = require('express');
const router = express.Router();
const { getAllSales, getSaleById, getSalesBetween, createSale, updateSale } = require('../controllers/saleController');

router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.get('/sales/range', getSalesBetween);
router.post('/', createSale);

module.exports = router;