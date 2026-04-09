const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "484de9ab78436b2c";

//login
const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if(result.rows.length === 0){
            return res.status(401).json({message: 'No user found'});
        }
        const user = result.rows[0];
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign(
                {id: user.id, role: user.role}, JWT_SECRET, {expiresIn: '8h'}
            );
            res.json({token, user: {id: user.id, role: user.role, email: user.email, full_name: user.full_name}});
        } else {
            return res.status(401).json({message: 'Invalid password'});
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

//all users
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
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
        res.status(500).send('Server error');
    }
};

//create user   
const createUser = async (req, res) => {
    const { full_name, email, role, password, hourly_rate } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10); 
        const result = await pool.query(
            'INSERT INTO users (full_name, email, role, password, hourly_rate) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email',
            [full_name, email, role, hashPassword, hourly_rate]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

//update user
const updateUser = async (req, res) => {
    const { id } = req.params; 
    const { name, email, role, hourly_rate } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, role = $3, hourly_rate = $4 WHERE id = $5 RETURNING *',
            [name, email, role, hourly_rate, id]
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
        res.status(500).send('Server error');
    }
};

module.exports = {getAllUsers, getUserById, createUser, updateUser, login};