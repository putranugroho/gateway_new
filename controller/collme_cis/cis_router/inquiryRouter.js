const express = require("express");
const router = express.Router();
require("dotenv").config;
const { validateApiKey } = require("../../../utils/validateApiKey");
const { insertLog } = require("../../cms/insertlogcms");
const { printreq, printres } = require("../../../utils/getprint");
const { callAPI } = require("../../../utils/execAPI");
const { URL_COLLME, API_KEY_COLLME } = process.env;

router.post("/", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "x-api-key": API_KEY_COLLME,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "INQUIRY REKENING");
  response = await callAPI(URL_COLLME, "inquiry", req.body, header);
  printres(response, "INQUIRY REKENING");
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
module.exports = router;
