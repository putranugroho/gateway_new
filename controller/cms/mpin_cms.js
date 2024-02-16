const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../../utils/validateApiKey');
const { printreq, printres } = require('../../utils/getprint');
const { callAPI } = require('../../utils/execAPI')
const Validator = require('fastest-validator');
const { insertLog } = require('./insertlogcms');
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env

router.post('/generate', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    var { noreff, bpr_id } = req.body
    printreq(req.body, "GENERATE MPIN");
    response = await callAPI(CMS_URL, "mpin/generate", req.body, header)
    printres(response, "GENERATE MPIN");
    var log = {
        request: req.body,
        response
    }
    if (typeof noreff === 'undefined') {
        noreff = ''
    }

    if (typeof bpr_id === 'undefined') {
        bpr_id = ''
    }

    insertLog(log, noreff, bpr_id)
    res.status(200).send(response);
});


router.post('/listgenerate', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    var { noreff, bpr_id } = req.body
    printreq(req.body, "LIST GENERATE MPIN");
    response = await callAPI(CMS_URL, "mpin", req.body, header)
    printres(response, "LIST GENERATE MPIN");
    var log = {
        request: req.body,
        response
    }
    if (typeof noreff === 'undefined') {
        noreff = ''
    }

    if (typeof bpr_id === 'undefined') {
        bpr_id = ''
    }

    insertLog(log, noreff, bpr_id)
    res.status(200).send(response);
});


router.post('/checkmpin', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    var { noreff, bpr_id } = req.body
    printreq(req.body, "CEK MPIN");
    response = await callAPI(CMS_URL, "mpin/checkmpin", req.body, header)
    printres(response, "CEK MPIN");
    var log = {
        request: req.body,
        response
    }
    if (typeof noreff === 'undefined') {
        noreff = ''
    }

    if (typeof bpr_id === 'undefined') {
        bpr_id = ''
    }

    insertLog(log, noreff, bpr_id)
    res.status(200).send(response);
});
module.exports = router