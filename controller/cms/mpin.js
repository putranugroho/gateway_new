const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../../utils/validateApiKey');
const { printreq, printres } = require('../../utils/getprint');
const { callAPI } = require('../../utils/execAPI')
const Validator = require('fastest-validator');
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env

router.post('/updatests', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "UPDATE STATUS MPIN");
    response = await callAPI(CMS_URL, "gw/mpin/updatests", req.body, header)
    printres(response, "UPDATE STATUS MPIN");
    res.status(200).send(response);
});


router.post('/updatempin', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "UPDATE STATUS MPIN");
    response = await callAPI(CMS_URL, "gw/mpin/updatempin", req.body, header)
    printres(response, "UPDATE STATUS MPIN");
    res.status(200).send(response);
});

module.exports = router