const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config;
const { URL_CMS } = process.env;

const useridrouter = require("../controller/cms/inquiry");
const mpinrouter = require("../controller/cms/mpin_trx");
const glrouter = require("../controller/cms/gl");
const logrouter = require("../controller/cms/logs");
const updaterouter = require("../controller/cms/update");
const ppobrouter = require("../controller/cms/ppob");
const echorouter = require("../controller/cms/echo");

router.use("/inquiry", useridrouter);
router.use("/mpin", mpinrouter);
router.use("/gl", glrouter);
router.use("/log", logrouter);
router.use("/update", updaterouter);
router.use("/ppob", ppobrouter);
router.use("/echo", echorouter);

module.exports = router;
