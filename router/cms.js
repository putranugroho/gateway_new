const express = require('express');
const app = express();
const router = express.Router();
require('dotenv').config;
const { URL_CMS } = process.env

const useridrouter = require('../controller/cms/userid')

router.use('/userid', useridrouter)

module.exports = router
