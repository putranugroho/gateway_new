const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../utils/validateApiKey');
const { URL_CMS } = process.env

router.post('/', validateApiKey, async (req, res) => {
    res.status(200).send("Welcome to Gateway IBPR API")
});
router.get('/', validateApiKey, async (req, res) => {
    res.status(200).send("Welcome to Gateway IBPR API")
});

module.exports = router