const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');


const { URL_COLLME } = process.env
var response

router.post('/all', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'company/all', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/byname', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'company/byname', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/add', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'company/add', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/addpt', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'company/addpt', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/chg', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'company/chg', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/del', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'company/del', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
module.exports = router