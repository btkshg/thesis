const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, login } = require('../controllers/userController');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.post('/login', login)

module.exports = router;