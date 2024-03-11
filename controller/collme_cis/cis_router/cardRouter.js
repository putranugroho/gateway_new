const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');

const { URL_COLLME } = process.env
var response

router.post('/insert', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'card/insert', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});


router.post('/getall', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'card/getall', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

router.post('/updatests', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'card/updatests', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
module.exports = router