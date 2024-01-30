const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../../utils/validateApiKey');
const { insertLog } = require('../../cms/insertlogcms');
const { printreq, printres } = require('../../../utils/getprint');
const { callAPI } = require('../../../utils/execAPI');
const { URL_COLLME } = process.env

router.post('/', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    var { noreff, bpr_id } = req.body
    printreq(req.body, "login");
    response = await callAPI(URL_COLLME, "inquiry", req.body, header)
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
module.exports = router

