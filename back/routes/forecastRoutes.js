const express = require('express');
const router = express.Router();
const axios = require('axios');
const fastapi = 'http://localhost:8000'

router.get('/sales', async(req, res) => {
    try {
        const { days } = req.query;
        const response = await axios.get(`${fastapi}/sales?days=${days || 7}`);
        res.json(response.data);
    } catch(err){
        console.error(err.message);
        res.status(501);
    }
});

module.exports = router;