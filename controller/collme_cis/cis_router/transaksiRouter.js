const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');
const { callAPI } = require('../../../utils/execAPI');
const { printres, printreq } = require('../../../utils/getprint');

const { URL_COLLME } = process.env
var response

router.post('/', validateApiKey, async (req, res) => {
    printreq(req.body, "TRANSAKSI")
    response = await callAPI(URL_COLLME, 'gw', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "TRANSAKSI")
    res.status(200).send(response);
});
router.post('/callback', validateApiKey, async (req, res) => {
    printreq(req.body, "TRANSAKSI CALLBACK")
    response = await callAPI(URL_COLLME, 'transaksi/callback', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "TRANSAKSI CALLBACK")
    res.status(200).send(response);
});
module.exports = router