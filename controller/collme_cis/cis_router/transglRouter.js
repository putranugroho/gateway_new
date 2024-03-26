const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');
const { callAPI } = require('../../../utils/execAPI');

const { URL_COLLME } = process.env
var response

router.post('/list', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'transgl/list', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

router.post('/master', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'transgl/master', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

router.post('/insert', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'transgl/insert', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
module.exports = router