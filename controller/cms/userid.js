const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../../utils/validateApiKey');
const { printreq, printres } = require('../../utils/getprint');
const { callAPI } = require('../../utils/execAPI')
const Validator = require('fastest-validator');
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env

router.post('/login', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "login");
    response = await callAPI(CMS_URL, "cms/userid/login", req.body, header)
    printres(response, "login");
    res.status(200).send(response);
});

module.exports = router