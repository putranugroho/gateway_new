const express = require("express");
const {
    inquiry_account,
    transfer,
    withdrawal,
    ppob,
    sign_in_off,
    list_log_gateway,
    list_log_core } = require("../controller/gateway_bpr_new");

const router = express.Router();

router.post("/inquiry_account", inquiry_account);
router.post("/transfer", transfer);
router.post("/withdrawal", withdrawal);
router.post("/ppob", ppob);
router.post("/sign_in_off", sign_in_off);
router.post("/list_log_gateway", list_log_gateway);
router.post("/list_log_core", list_log_core);

module.exports = router;