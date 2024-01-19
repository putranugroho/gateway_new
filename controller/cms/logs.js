const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../../utils/validateApiKey');
const { printreq, printres } = require('../../utils/getprint');
const { callAPI } = require('../../utils/execAPI')
const Validator = require('fastest-validator');
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env

router.post('/holdtrx', validateApiKey, async (req, res) => {
    let response = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    printreq(req.body, "LOG HOLD TRANSACTION ");
    response = await callAPI(CMS_URL, "gw/log/holdtransaction", req.body, header)
    printres(response, "LOG HOLD TRANSACTION");
    res.status(200).send(response);
});

module.exports = router