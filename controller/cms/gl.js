const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../../utils/validateApiKey');
const { printreq, printres } = require('../../utils/getprint');
const { callAPI } = require('../../utils/execAPI')
const Validator = require('fastest-validator');
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env

router.post('/glkdacct', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "LIST KDACCT ");
    response = await callAPI(CMS_URL, "gw/gl/kdacc", req.body, header)
    printres(response, "LIST KDACCT");
    res.status(200).send(response);
});


router.post('/gltranssbb', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "CEK GL TRANS");
    response = await callAPI(CMS_URL, "gw/gl/sbbgltrans", req.body, header)
    printres(response, "CEK GL TRANS");
    res.status(200).send(response);
});


module.exports = router