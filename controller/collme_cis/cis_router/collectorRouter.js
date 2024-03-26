const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');
const { callAPI } = require('../../../utils/execAPI');

const { URL_COLLME } = process.env
var response

router.post('/add', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'collector/add', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/chg', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'collector/chg', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/del', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'collector/del', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/blok', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'collector/blok', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/aktivasi', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'collector/aktivasi', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/unblock', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'collector/unblock', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/all', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'collector/all', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/hp', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'collector/hp', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
router.post('/name', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'collector/name', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});
module.exports = router