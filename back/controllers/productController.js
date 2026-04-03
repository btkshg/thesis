const pool = require('../db');

const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY name ASC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getLowStockProducts = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM products 
             WHERE stock_quantity <= reorder_level 
             ORDER BY stock_quantity ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const createProduct = async (req, res) => {
    const { name, category, base_price, stock_quantity, reorder_level } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO products (name, category, base_price, current_price, stock_quantity, reorder_level)
             VALUES ($1, $2, $3, $3, $4, $5) RETURNING *`,
            [name, category, base_price, stock_quantity, reorder_level]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, base_price, current_price, stock_quantity, reorder_level } = req.body;
    try {
        const result = await pool.query(
            `UPDATE products 
             SET name = $1, category = $2, base_price = $3, current_price = $4,
                 stock_quantity = $5, reorder_level = $6
             WHERE id = $7 RETURNING *`,
            [name, category, base_price, current_price, stock_quantity, reorder_level, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateProductPrice = async (req, res) => {
    const { id } = req.params;
    const { current_price } = req.body;
    try {
        const result = await pool.query(
            `UPDATE products SET current_price = $1 WHERE id = $2 RETURNING *`,
            [current_price, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted', product: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getAllProducts, getProductById, getLowStockProducts, createProduct, 
    updateProduct, updateProductPrice, deleteProduct };