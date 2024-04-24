const express = require("express");
const router = express.Router();
require("dotenv").config;
const { validateApiKey } = require("../../../utils/validateApiKey");
const { callAPI } = require("../../../utils/execAPI");
const { printreq, printres } = require("../../../utils/getprint");

const { URL_COLLME } = process.env;
var response;

router.post("/add", validateApiKey, async (req, res) => {
  printreq(req.body, "INSERT COLLECTOR");
  response = await callAPI(URL_COLLME, "collector/add", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "INSERT COLLECTOR");

  res.status(200).send(response);
});
router.post("/chg", validateApiKey, async (req, res) => {
  printreq(req.body, "UPDATE COLLECTOR");
  response = await callAPI(URL_COLLME, "collector/chg", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "UPDATE COLLECTOR");
  res.status(200).send(response);
});
router.post("/del", validateApiKey, async (req, res) => {
  printreq(req.body, "DELETE COLLECTOR");
  response = await callAPI(URL_COLLME, "collector/del", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "DELETE COLLECTOR");
  res.status(200).send(response);
});
router.post("/blok", validateApiKey, async (req, res) => {
  printreq(req.body, "BLOKIR COLLECTOR");
  response = await callAPI(URL_COLLME, "collector/blok", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "BLOKIR COLLECTOR");
  res.status(200).send(response);
});
router.post("/aktivasi", validateApiKey, async (req, res) => {
  printreq(req.body, "AKTIVASI COLLECTOR");
  response = await callAPI(URL_COLLME, "collector/aktivasi", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "AKTIVASI COLLECTOR");
  res.status(200).send(response);
});
router.post("/unblock", validateApiKey, async (req, res) => {
  printreq(req.body, "BUKA BLOKIR COLLECTOR");
  response = await callAPI(URL_COLLME, "collector/unblock", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "BUKA BLOKIR COLLECTOR");
  res.status(200).send(response);
});
router.post("/all", validateApiKey, async (req, res) => {
  printreq(req.body, "LIST ALL COLLECTOR");
  response = await callAPI(URL_COLLME, "collector/all", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "LIST ALL COLLECTOR");
  res.status(200).send(response);
});
router.post("/hp", validateApiKey, async (req, res) => {
  printreq(req.body, "LIST ALL COLLECTOR BY NOMOR HP");
  response = await callAPI(URL_COLLME, "collector/hp", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "LIST ALL COLLECTOR BY NOMOR HP");
  res.status(200).send(response);
});
router.post("/name", validateApiKey, async (req, res) => {
  printreq(req.body, "LIST ALL COLLECTOR BY NOMOR NAME");
  response = await callAPI(URL_COLLME, "collector/name", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "LIST ALL COLLECTOR BY NOMOR NAME");
  res.status(200).send(response);
});
module.exports = router;
