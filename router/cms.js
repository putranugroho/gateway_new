const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config;
const { URL_CMS } = process.env;

const useridrouter = require("../controller/cms/userid");
const mpinrouter = require("../controller/cms/mpin_cms");
const kantorrouter = require("../controller/cms/kantor");
const akunrouter = require("../controller/cms/akun");
const acctyperouter = require("../controller/cms/accttype");
const inquiryrouter = require("../controller/cms/inquiry");
const glrouter = require("../controller/cms/gl");
const aktivasirouter = require("../controller/cms/aktivasi");

router.use("/userid", useridrouter);
router.use("/mpin", mpinrouter);
router.use("/kantor", kantorrouter);
router.use("/akun", akunrouter);
router.use("/acctype", acctyperouter);
router.use("/inquiry", inquiryrouter);
router.use("/gl", glrouter);
router.use("/aktivasi", aktivasirouter);

module.exports = router;
