const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');
const { callAPI } = require('../../../utils/execAPI');
const { printreq, printres } = require('../../../utils/getprint');


const { URL_COLLME } = process.env
var response

router.post('/generate', validateApiKey, async (req, res) => {
    printreq(req.body, "GENERATE MPIN")
    response = await callAPI(URL_COLLME, 'mpin/generate', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "GENERATE MPIN")
    res.status(200).send(response);
});
router.post('/getlist', validateApiKey, async (req, res) => {
    printreq(req.body, "LIST MPIN")
    response = await callAPI(URL_COLLME, 'mpin/getlist', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "LIST MPIN")
    res.status(200).send(response);
});
router.post('/reset', validateApiKey, async (req, res) => {
    printreq(req.body, "RESET MPIN")
    response = await callAPI(URL_COLLME, 'mpin/reset', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "RESET MPIN")
    res.status(200).send(response);
});
router.post('/check', validateApiKey, async (req, res) => {
    printreq(req.body, "CEK MPIN")
    response = await callAPI(URL_COLLME, 'mpin/check', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "CEK MPIN")
    res.status(200).send(response);
});
router.post('/cetak', validateApiKey, async (req, res) => {
    printreq(req.body, "CETAK MPIN")
    response = await callAPI(URL_COLLME, 'mpin/cetak', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "CETAK MPIN")
    res.status(200).send(response);
});
router.post('/chg', validateApiKey, async (req, res) => {
    printreq(req.body, "UBAH MPIN")
    response = await callAPI(URL_COLLME, 'mpin/chg', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "UBAH MPIN")
    res.status(200).send(response);
});
router.post('/val', validateApiKey, async (req, res) => {
    printreq(req.body, "VALIDASI MPIN")
    response = await callAPI(URL_COLLME, 'mpin/val', req.body, { 'x-api-key': 'X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=' });
    printres(response, "VALIDASI MPIN")
    res.status(200).send(response);
});
module.exports = router