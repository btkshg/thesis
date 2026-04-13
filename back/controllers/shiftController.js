const pool = require('../db');

const getAllShifts = async (req, res) => {
    try {
        const result = await pool.query('SELECT sh.*, u.full_name FROM shifts sh INNER JOIN users u ON sh.user_id = u.id ORDER BY sh.start_time DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getShiftById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM shifts WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getShiftByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM shifts WHERE user_id = $1 ORDER BY start_time DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const startShift = async (req, res) => {
    const { user_id } = req.body;
    try {
        const open = await pool.query(
            'SELECT * FROM shifts WHERE user_id = $1 AND end_time IS NULL',
            [user_id]
        );
        if (open.rows.length > 0) {
            return res.status(400).json({ message: 'User already has an open shift' });
        }

        const result = await pool.query(
            'INSERT INTO shifts (user_id, start_time) VALUES ($1, CURRENT_TIMESTAMP) RETURNING *',
            [user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Database error' });
    }
};

const endShift = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE shifts 
             SET end_time = CURRENT_TIMESTAMP,
                 total_hours = ROUND(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - start_time)) / 3600, 2)
             WHERE id = $1 AND end_time IS NULL 
             RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Shift not found or already closed' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteShift = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM shifts WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.json({ message: 'Shift deleted', shift: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getAllShifts, getShiftById, getShiftByUser, startShift, endShift, deleteShift };