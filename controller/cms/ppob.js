const express = require("express");
const router = express.Router();
const { validateApiKey } = require("../../utils/validateApiKey");
const { printreq, printres } = require("../../utils/getprint");
const Validator = require("fastest-validator");
const { transaksi_ppob } = require("../ppob/transaksi_ppob");
const { insertlogGW } = require("./insertlogcms");
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env;

router.post("/transppob", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };

  const schema = {
    bpr_id: "string",
    nohp: "string",
    mpin: "string",
    trx_code: "string",
    trx_type: "string",
    noreff: "string",
    tgl_trans: "string",
    norek: "string",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    console.log(validate);
    return res.status(200).send({
      code: "009",
      status: "gagal",
      message: "bad request",
    });
  }

  const { trx_code, norek, bpr_id, tgl_trans, noreff } = req.body;
  if (trx_code === "5000") {
    printreq(req.body, "TRANSAKSI PPOB");
    response = await transaksi_ppob(req.body);
    datalog = {
      request: req.body,
      response,
    };
    insertlogGW(bpr_id, tgl_trans, norek, noreff, datalog);
    printres(response, "TRANSAKSI PPOB");
  } else {
    response = {
      code: "099",
      status: "gagal",
      message: "trx_code tidak terdaftar",
    };
  }

  return res.status(200).send(response);
});
module.exports = router;
