const express = require("express");
const {
    inquiry_account,
    transfer,
    withdrawal,
    ppob,
    sign_in_off } = require("../controller/gateway_bpr_new");

const router = express.Router();

router.post("/inquiry_account", inquiry_account);
router.post("/transfer", transfer);
router.post("/withdrawal", withdrawal);
router.post("/ppob", ppob);
router.post("/sign_in_off", sign_in_off);

module.exports = router;