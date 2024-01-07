const express = require('express');
const app = express();
const router = express.Router();
require('dotenv').config;
const { URL_CMS } = process.env

const useridrouter = require('../controller/cms/inquiry')
const mpinrouter = require('../controller/cms/mpin')
const glrouter = require('../controller/cms/gl')
const logrouter = require('../controller/cms/logs')
const updaterouter = require('../controller/cms/update')
router.use('/inquiry', useridrouter)
router.use('/mpin', mpinrouter)
router.use('/gl', glrouter)
router.use('/log', logrouter)
router.use('/update', updaterouter)

module.exports = router
