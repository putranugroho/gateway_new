const express = require("express");
const router = express.Router();
const { validateApiKey } = require("../../utils/validateApiKey");
const { printreq, printres } = require("../../utils/getprint");
const { callAPI } = require("../../utils/execAPI");
const Validator = require("fastest-validator");
const { insertLog } = require("./insertlogcms");
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env;

router.post("/add-rate-produk", validateApiKey, async (req, res) => {
    try {
        let header = {
            "api-key": API_KEY_CMS,
        };
        printreq(req, "Add Rate Produk");
        const { produk, jns_produk } = req.body;

        const schema = {
            produk: "string",
            jns_produk: "string",
        };
        const validate = v.validate(req.body, schema);
        if (validate.length) {
            printres(validate, "Add Rate Produk");
            return res.status(200).json(validate);
        }
        const data = {
            produk: produk,
            jns_produk: jns_produk,
        };
        const result = await callAPI(
            CMS_URL, '/setup/add-rate-produk',
            data,
            header
        );

        var log = {
            request: req.body,
            response: result
        };
        if (typeof noreff === "undefined") {
            noreff = "";
        }

        if (typeof bpr_id === "undefined") {
            bpr_id = "";
        }

        insertLog(log, noreff, bpr_id);

        if (result.status == 200) {
            printres(result, "Add Rate Produk");
            return res.status(200).json(result);
        } else {
            printres(result, "Add Rate Produk");
            return res.status(200).json(result);
        }
    } catch (error) {
        printres(error, "Add Rate Produk");
        return res.status(500).json(error);
    }
});

router.post("/delete-rate-produk", validateApiKey, async (req, res) => {
    try {
        let header = {
            "api-key": API_KEY_CMS,
        };
        printreq(req, "Delete Rate Produk");
        const { produk, jns_produk } = req.body;
        const schema = {
            produk: "string",
            jns_produk: "string",
        };
        const validate = v.validate(req.body, schema);
        if (validate.length) {
            printres(validate, "Delete Rate Produk");
            return res.status(200).json(validate);
        }
        const data = {
            produk: produk,
            jns_produk: jns_produk,
        };
        const result = await callAPI(
            CMS_URL, '/setup/delete-rate-produk',
            data,
            header
        );
        var log = {
            request: req.body,
            response: result
        };
        if (typeof noreff === "undefined") {
            noreff = "";
        }
        if (typeof bpr_id === "undefined") {
            bpr_id = "";
        }
        insertLog(log, noreff, bpr_id);
        if (result.status == 200) {
            printres(result, "Delete Rate Produk");
            return res.status(200).json(result);
        } else {
            printres(result, "Delete Rate Produk");
            return res.status(200).json(result);
        }
    } catch (error) {
        printres(error, "Delete Rate Produk");
        return res.status(500).json(error);
    }
});


router.post("/get-rate-produk", validateApiKey, async (req, res) => {
    try {
        let header = {
            "api-key": API_KEY_CMS,
        };
        printreq(req, "Get Rate Produk");
        const { produk, jns_produk } = req.body;
        const schema = {
            produk: "string",
            jns_produk: "string",
        };
        const validate = v.validate(req.body, schema);
        if (validate.length) {
            printres(validate, "Get Rate Produk");
            return res.status(200).json(validate);
        }
        const data = {
            produk: produk,
            jns_produk: jns_produk,
        };
        const result = await callAPI(
            CMS_URL, '/setup/get-rate-produk',
            data,
            header
        );
        var log = {
            request: req.body,
            response: result
        };
        if (typeof noreff === "undefined") {
            noreff = "";
        }
        if (typeof bpr_id === "undefined") {
            bpr_id = "";
        }
        insertLog(log, noreff, bpr_id);
        if (result.status == 200) {
            printres(result, "Get Rate Produk");
            return res.status(200).json(result);
        } else {
            printres(result, "Get Rate Produk");
            return res.status(200).json(result);
        }
    } catch (error) {
        printres(error, "Get Rate Produk");
        return res.status(500).json(error);
    }
});
module.exports = router;