const express = require('express');
const router = express.Router();
const { getAllSales, getSaleById, getSalesBetween, createSale, totalTrans, dailyRev, salesGrowth } = require('../controllers/saleController');

router.get('/growth', salesGrowth);
router.get('/totalTrans', totalTrans);
router.get('/range', getSalesBetween);
router.get('/dailyRevenue', dailyRev);
router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.post('/', createSale);

module.exports = router;