const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');
const { callAPI } = require('../../../utils/execAPI');
const { printreq, printres } = require('../../../utils/getprint');

const { URL_COLLME } = process.env
var response

router.post('/all', validateApiKey, async (req, res) => {
    printreq(req.body, "LIST USER ID")
    response = await callAPI(URL_COLLME, 'userid/all', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "LIST USER ID")
    res.status(200).send(response);
});

router.post('/logout', validateApiKey, async (req, res) => {
    printreq(req.body, "LOGOUT")
    response = await callAPI(URL_COLLME, 'userid/logout', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "LOGOUT")
    res.status(200).send(response);
});


router.post('/login', validateApiKey, async (req, res) => {
    printreq(req.body, "LOGIN")
    response = await callAPI(URL_COLLME, 'userid/login', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "LOGIN")
    res.status(200).send(response);
});

router.post('/otorisasi', validateApiKey, async (req, res) => {
    printreq(req.body, "OTORISASI USER ID")
    response = await callAPI(URL_COLLME, 'userid/otorisasi', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "OTORISASI USER ID")
    res.status(200).send(response);
});

router.post('/getlistotor', validateApiKey, async (req, res) => {
    printreq(req.body, "LIST OTORISASI USER ID")
    response = await callAPI(URL_COLLME, 'userid/getlistotor', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "LIST OTORISASI USER ID")
    res.status(200).send(response);
});

router.post('/byname', validateApiKey, async (req, res) => {
    printreq(req.body, "LIST USER ID BY NAME")
    response = await callAPI(URL_COLLME, 'userid/byname', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "LIST USER ID BY NAME")
    res.status(200).send(response);
});

router.post('/user', validateApiKey, async (req, res) => {
    printreq(req.body, "LIST USER ID BY USERID")
    response = await callAPI(URL_COLLME, 'userid/user', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "LIST USER ID BY USERID")
    res.status(200).send(response);
});

router.post('/add', validateApiKey, async (req, res) => {
    printreq(req.body, "INSERT USERID")
    response = await callAPI(URL_COLLME, 'userid/add', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "INSERT USERID")
    res.status(200).send(response);
});


router.post('/chg', validateApiKey, async (req, res) => {
    printreq(req.body, "UPDATE USERID")
    response = await callAPI(URL_COLLME, 'userid/chg', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "UPDATE USERID")
    res.status(200).send(response);
});


router.post('/del', validateApiKey, async (req, res) => {
    printreq(req.body, "DELETE USERID")
    response = await callAPI(URL_COLLME, 'userid/del', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "DELETE USERID")
    res.status(200).send(response);
});


router.post('/validasi', validateApiKey, async (req, res) => {
    printreq(req.body, "VALIDASI USERID")
    response = await callAPI(URL_COLLME, 'userid/validasi', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "VALIDASI USERID")
    res.status(200).send(response);
});

module.exports = router