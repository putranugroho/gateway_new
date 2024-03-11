const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');

const { URL_COLLME } = process.env
var response

router.post('/master', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'akses/master', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/master', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'akses/master', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/userid', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'akses/userid', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/userid/menu', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'akses/userid/menu', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/userid/submenu', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'akses/userid/submenu', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

module.exports = router