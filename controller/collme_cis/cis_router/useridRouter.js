const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');
const { callAPI } = require('../../../utils/execAPI');

const { URL_COLLME } = process.env
var response

router.post('/all', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'userid/all', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

router.post('/logout', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'userid/logout', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

router.post('/otorisasi', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'userid/otorisasi', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

router.post('/getlistotor', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'userid/getlistotor', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

router.post('/byname', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'userid/byname', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

router.post('/user', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'userid/user', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

router.post('/add', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'userid/add', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});


router.post('/chg', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'userid/chg', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});


router.post('/del', validateApiKey, async (req, res) => {
    response = await callAPI(URL_COLLME, 'userid/del', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    res.status(200).send(response);
});

module.exports = router