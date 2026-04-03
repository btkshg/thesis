const express = require('express');
const router = express.Router();
const { getAllShifts, startShift, endShift, getShiftById, getShiftByUser, deleteShift} = require('../controllers/shiftController');

router.get('/', getAllShifts);
router.get('/:id', getShiftById);
router.get('/user/:id', getShiftByUser);
router.post('/', startShift);
router.put('/:id', endShift);
router.delete('/:id', deleteShift);

module.exports = router;