const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../../utils/validateApiKey');
const { printreq, printres } = require('../../utils/getprint');
const { callAPI } = require('../../utils/execAPI')
const Validator = require('fastest-validator');
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env

router.post('/acct', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "INQUERY ACCOUNT");
    response = await callAPI(CMS_URL, "gw/inq/acct", req.body, header)
    printres(response, "INQUERY ACCOUNT");
    res.status(200).send(response);
});


router.post('/validatenorek', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "VALIDATE NOREK");
    response = await callAPI(CMS_URL, "gw/inq/validatenorek", req.body, header)
    printres(response, "VALIDATE NOREK");
    res.status(200).send(response);
});


router.post('/validatenohp', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "VALIDATE NOREK");
    response = await callAPI(CMS_URL, "gw/inq/validatenohp", req.body, header)
    printres(response, "VALIDATE NOREK");
    res.status(200).send(response);
});


router.post('/validatekeeping', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "VALIDATE ACCOUNT KEEPING");
    response = await callAPI(CMS_URL, "gw/inq/validatekeeping", req.body, header)
    printres(response, "VALIDATE ACCOUNT KEEPING");
    res.status(200).send(response);
});


router.post('/validatenorekhp', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "VALIDATE NOREK DAN NOHP");
    response = await callAPI(CMS_URL, "gw/inq/validatenorekhp", req.body, header)
    printres(response, "VALIDATE NOREK DAN NOHP");
    res.status(200).send(response);
});


router.post('/cekktp', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "CEK KTP");
    response = await callAPI(CMS_URL, "gw/inq/cekktp", req.body, header)
    printres(response, "CEK KTP");
    res.status(200).send(response);
});


router.post('/limitacctype', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "CEK LIMIT ACCTYPE");
    response = await callAPI(CMS_URL, "gw/inq/ceklimit", req.body, header)
    printres(response, "CEK LIMIT ACCTYPE");
    res.status(200).send(response);
});


router.post('/stscore', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "CEK STATUS CORE");
    response = await callAPI(CMS_URL, "gw/inq/stscore", req.body, header)
    printres(response, "CEK STATUS CORE");
    res.status(200).send(response);
});

module.exports = router