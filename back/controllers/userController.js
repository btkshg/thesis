const pool = require('../db');
const bcrypt = require('bcrypt');

//all users
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

//get user by id
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

//create user   
const createUser = async (req, res) => {
    const { name, email, position, password, hourly_rate } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10); 
        const result = await pool.query(
            'INSERT INTO users (name, username, position, password, hourly_rate) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email',
            [name, email, position, hashPassword, hourly_rate]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

//update user
const updateUser = async (req, res) => {
    const { id } = req.params; 
    const { name, email, position, hourly_rate } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, position = $3, hourly_rate = $4 WHERE id = $5 RETURNING *',
            [name, email, position, hourly_rate, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: "Email is already taken by another user." });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {getAllUsers, getUserById, createUser, updateUser};