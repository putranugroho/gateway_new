const express = require("express");
const router = express.Router();
const Validator = require("fastest-validator");
const { validateApiKey } = require("../../utils/validateApiKey");
const { printreq, printres } = require("../../utils/getprint");
const { callAPI } = require("../../utils/execAPI");
const v = new Validator();
const { CORE_URL } = process.env;

router.post("/coreecho", validateApiKey, async (req, res) => {
  let response = {};
  let header = {};
  printreq(req.body, "ECHO CORE");
  response = await callAPI(CORE_URL, "echo", req.body, header);
  printres(response, "ECHO CORE");
  res.status(200).send(response);
});

module.exports = router;
