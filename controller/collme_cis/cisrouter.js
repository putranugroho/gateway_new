const express = require('express');
const router = express.Router();
require('dotenv').config;
const { validateApiKey } = require('../../utils/validateApiKey');


const useridRouter = require('./cis_router/useridRouter')
const inquiryRouter = require('./cis_router/inquiryRouter')
const aksesRouter = require('./cis_router/aksesRouter')
const companyRouter = require('./cis_router/companyRouter')
const collectorRouter = require('./cis_router/collectorRouter')
const mpinRouter = require('./cis_router/mpinRouter')
const transglRouter = require('./cis_router/transglRouter')
const cardRouter = require('./cis_router/cardRouter')
const transaksiRouter = require('./cis_router/transaksiRouter')

router.use('/userid', useridRouter);
router.use('/inquiry', inquiryRouter);
router.use('/akses', aksesRouter);
router.use('/company', companyRouter);
router.use('/collector', collectorRouter);
router.use('/mpin', mpinRouter);
router.use('/transgl', transglRouter);
router.use('/card', cardRouter);
router.use('/transaksi', transaksiRouter);

router.post('/', validateApiKey, async (req, res) => {
    res.status(200).send("API CIS");
});
router.get('/', validateApiKey, async (req, res) => {
    res.status(200).send("API CIS");
});

module.exports = router