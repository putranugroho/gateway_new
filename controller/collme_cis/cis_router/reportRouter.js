const express = require("express");
const router = express.Router();
require("dotenv").config;
const { validateApiKey } = require("../../../utils/validateApiKey");
const { callAPI } = require("../../../utils/execAPI");
const { printreq, printres } = require("../../../utils/getprint");

const { URL_COLLME } = process.env;
var response;

router.post("/periode", validateApiKey, async (req, res) => {
  printreq(req.body, "REPORT TRANSAKSI COLL PERIODE");
  const requestBody = {
    report_type: "list_trn_collector_periode",
    ...req.body,
  };
  response = await callAPI(URL_COLLME, "report", requestBody, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "REPORT TRANSAKSI COLL PERIODE");
  res.status(200).send(response);
});

router.post("/", validateApiKey, async (req, res) => {
  printreq(req.body, "REPORT TRANSAKSI COLL ");

  response = await callAPI(URL_COLLME, "report", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "REPORT TRANSAKSI COLL ");
  res.status(200).send(response);
});

module.exports = router;
