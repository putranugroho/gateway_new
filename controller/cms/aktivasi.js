const express = require("express");
const { validateApiKey } = require("../../utils/validateApiKey");
const { printreq, printres } = require("../../utils/getprint");
const { insertLog } = require("./insertlogcms");
const router = express.Router();

module.exports = router;

const { CMS_URL, API_KEY_CMS } = process.env;

router.post("/", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "AKTIVASI AKUN");
  response = await callAPI(CMS_URL, "aktivasi", req.body, header);
  printres(response, "AKTIVASI AKUN");
  var log = {
    request: req.body,
    response,
  };
  if (typeof noreff === "undefined") {
    noreff = "";
  }

  if (typeof bpr_id === "undefined") {
    bpr_id = "";
  }

  insertLog(log, noreff, bpr_id);
  res.status(200).send(response);
});
