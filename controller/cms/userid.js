const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../../utils/validateApiKey');
const { printreq, printres } = require('../../utils/getprint');
const { callAPI } = require('../../utils/execAPI')
const Validator = require('fastest-validator');
const { insertLog } = require('./insertlogcms');
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env

router.post('/login', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    var { noreff, bpr_id } = req.body
    printreq(req.body, "login");
    response = await callAPI(CMS_URL, "userid/login", req.body, header)
    printres(response, "login");
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


router.post('/logout', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "Logout");
    response = await callAPI(CMS_URL, "userid/updatests", req.body, header)
    printres(response, "Logout");
    res.status(200).send(response);
});



router.post('/mastermenu', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "GET ALL MASTER FASILITAS");
    response = await callAPI(CMS_URL, "fasilitas-akses", req.body, header)
    printres(response, "GET ALL MASTER FASILITAS");
    res.status(200).send(response);
});


module.exports = router