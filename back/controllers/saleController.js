const pool = require('../db');

const getAllSales = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT sh.*, u.full_name as cashier
             FROM sales_header sh
             JOIN users u ON sh.user_id = u.id
             ORDER BY sh.sale_time DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getSaleById = async (req, res) => {
    const { id } = req.params;
    try {
        const header = await pool.query(
            `SELECT sh.*, u.full_name as cashier
             FROM sales_header sh
             JOIN users u ON sh.user_id = u.id
             WHERE sh.id = $1`,
            [id]
        );
        if (header.rows.length === 0) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        const body = await pool.query(
            `SELECT sb.*, p.name as product_name
             FROM sale_body sb
             JOIN products p ON sb.product_id = p.id
             WHERE sb.sale_header_id = $1`,
            [id]
        );
        res.json({ ...header.rows[0], items: body.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getSalesBetween = async (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) {
        return res.status(400).json({ message: 'from and to query params are required' });
    }
    try {
        const result = await pool.query(
            `SELECT sh.*, u.full_name as cashier
             FROM sales_header sh
             JOIN users u ON sh.user_id = u.id
             WHERE sh.sale_time BETWEEN $1 AND $2
             ORDER BY sh.sale_time ASC`,
            [from, to]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const createSale = async (req, res) => {
    const { user_id, items } = req.body;
    // items = [{ product_id, quantity, price_at_sale }, ...]

    if (!user_id || !items || items.length === 0) {
        return res.status(400).json({ message: 'user_id and items are required' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const total_amount = items.reduce((sum, item) =>
            sum + (item.price_at_sale * item.quantity), 0
        );

        const headerResult = await client.query(
            `INSERT INTO sales_header (user_id, total_amount, sale_time)
             VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *`,
            [user_id, total_amount]
        );
        const sale_header_id = headerResult.rows[0].id;

        for (const item of items) {
            // check stock is sufficient before deducting
            const stock = await client.query(
                'SELECT stock_quantity FROM products WHERE id = $1',
                [item.product_id]
            );
            if (stock.rows.length === 0) {
                throw new Error(`Product ${item.product_id} not found`);
            }
            if (stock.rows[0].stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ${item.product_id}`);
            }

            await client.query(
                `INSERT INTO sale_body (sale_header_id, product_id, quantity, price_at_sale)
                 VALUES ($1, $2, $3, $4)`,
                [sale_header_id, item.product_id, item.quantity, item.price_at_sale]
            );

            await client.query(
                `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
                [item.quantity, item.product_id]
            );
        }

        await client.query('COMMIT');
        res.status(201).json(headerResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: err.message || 'Transaction failed' });
    } finally {
        client.release();
    }
};

module.exports = { getAllSales, getSaleById, getSalesBetween, createSale };