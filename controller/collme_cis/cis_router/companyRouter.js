const express = require("express");
const router = express.Router();
require("dotenv").config;
const { validateApiKey } = require("../../../utils/validateApiKey");
const { callAPI } = require("../../../utils/execAPI");
const { printreq, printres } = require("../../../utils/getprint");

const { URL_COLLME } = process.env;
var response;

router.post("/all", validateApiKey, async (req, res) => {
  printreq(req.body, "LIST SEMUA KANTOR");
  response = await callAPI(URL_COLLME, "company/all", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "LIST SEMUA KANTOR");
  res.status(200).send(response);
});
router.post("/byname", validateApiKey, async (req, res) => {
  printreq(req.body, "LIST SEMUA KANTOR BY NAMA");
  response = await callAPI(URL_COLLME, "company/byname", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "LIST SEMUA KANTOR BY NAMA");
  res.status(200).send(response);
});
router.post("/add", validateApiKey, async (req, res) => {
  printreq(req.body, "INSERT KANTOR");
  response = await callAPI(URL_COLLME, "company/add", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "INSERT KANTOR");
  res.status(200).send(response);
});
router.post("/addpt", validateApiKey, async (req, res) => {
  printreq(req.body, "INSERT PT");
  response = await callAPI(URL_COLLME, "company/addpt", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "INSERT PT");
  res.status(200).send(response);
});
router.post("/chg", validateApiKey, async (req, res) => {
  printreq(req.body, "UPDATE KANTOR");
  response = await callAPI(URL_COLLME, "company/chg", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "UPDATE KANTOR");
  res.status(200).send(response);
});
router.post("/del", validateApiKey, async (req, res) => {
  printreq(req.body, "DELETE KANTOR");
  response = await callAPI(URL_COLLME, "company/del", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "DELETE KANTOR");
  res.status(200).send(response);
});
module.exports = router;
