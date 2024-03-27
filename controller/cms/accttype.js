const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../../utils/validateApiKey');
const { printreq, printres } = require('../../utils/getprint');
const { callAPI } = require('../../utils/execAPI')
const Validator = require('fastest-validator');
const { insertLog } = require('./insertlogcms');
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env

router.post('/listall', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    var { noreff, bpr_id } = req.body
    printreq(req.body, "acctype");
    response = await callAPI(CMS_URL, "acctype", req.body, header)
    printres(response, "acctype");
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


router.post('/insert', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    var { noreff, bpr_id } = req.body
    printreq(req.body, "acctype");
    response = await callAPI(CMS_URL, "acctype/insert", req.body, header)
    printres(response, "acctype");
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


router.post('/update', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    var { noreff, bpr_id } = req.body
    printreq(req.body, "acctype");
    response = await callAPI(CMS_URL, "acctype/update", req.body, header)
    printres(response, "acctype");
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


router.post('/delete', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    var { noreff, bpr_id } = req.body
    printreq(req.body, "acctype");
    response = await callAPI(CMS_URL, "acctype/delete", req.body, header)
    printres(response, "acctype");
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
