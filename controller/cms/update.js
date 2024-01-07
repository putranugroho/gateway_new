const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../../utils/validateApiKey');
const { printreq, printres } = require('../../utils/getprint');
const { callAPI } = require('../../utils/execAPI')
const Validator = require('fastest-validator');
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env

router.post('/tartunplus', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "UPDATE TARIK TUNAI PLUS");
    response = await callAPI(CMS_URL, "gw/update/tartunplus", req.body, header)
    printres(response, "UPDATE TARIK TUNAI PLUS");
    res.status(200).send(response);
});


router.post('/tartunmin', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "UPDATE TARIK TUNAI MIN");
    response = await callAPI(CMS_URL, "gw/update/tartunmin", req.body, header)
    printres(response, "UPDATE TARIK TUNAI MIN");
    res.status(200).send(response);
});


router.post('/trfplus', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "UPDATE TRANSFER PLUS");
    response = await callAPI(CMS_URL, "gw/update/trfplus", req.body, header)
    printres(response, "UPDATE TRANSFER PLUS");
    res.status(200).send(response);
});


router.post('/trfmin', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "UPDATE TRANSFER MIN");
    response = await callAPI(CMS_URL, "gw/update/trfmin", req.body, header)
    printres(response, "UPDATE TRANSFER MIN");
    res.status(200).send(response);
});


router.post('/pinbukplus', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "UPDATE PINBUK PLUS");
    response = await callAPI(CMS_URL, "gw/update/pinbukplus", req.body, header)
    printres(response, "UPDATE PINBUK PLUS");
    res.status(200).send(response);
});


router.post('/pinbukmin', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "UPDATE PINBUK MIN");
    response = await callAPI(CMS_URL, "gw/update/pinbukmin", req.body, header)
    printres(response, "UPDATE PINBUK MIN");
    res.status(200).send(response);
});

module.exports = router