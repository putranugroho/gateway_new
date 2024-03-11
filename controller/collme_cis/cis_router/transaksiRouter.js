const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');

const { URL_COLLME } = process.env
var response

router.post('/', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'transaksi', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/callback', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'transaksi/callback', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
module.exports = router