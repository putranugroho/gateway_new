const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');


router.post('/transaksi', validateApiKey, async (req, res) => {
    // response = await transaksi(req.body)
    res.status(200).send(response)
});
module.exports = router