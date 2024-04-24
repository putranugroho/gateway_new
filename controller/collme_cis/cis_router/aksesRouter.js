const express = require("express");
const router = express.Router();
require("dotenv").config;
const { validateApiKey } = require("../../../utils/validateApiKey");
const { callAPI } = require("../../../utils/execAPI");
const { printreq, printres } = require("../../../utils/getprint");

const { URL_COLLME } = process.env;
var response;

router.post("/master", validateApiKey, async (req, res) => {
  printreq(req.body, "LIST MASTER FASILITAS AKSES");
  response = await callAPI(URL_COLLME, "akses/master", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "LIST MASTER FASILITAS AKSES");
  res.status(200).send(response);
});
router.post("/userid", validateApiKey, async (req, res) => {
  printreq(req.body, "LIST FASILITAS AKSES BY USERID");
  response = await callAPI(URL_COLLME, "akses/userid", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "LIST FASILITAS AKSES BY USERID");
  res.status(200).send(response);
});
router.post("/userid/menu", validateApiKey, async (req, res) => {
  printreq(req.body, "LIST MASTER MENU");
  response = await callAPI(URL_COLLME, "akses/userid/menu", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "LIST MASTER MENU");
  res.status(200).send(response);
});
router.post("/userid/submenu", validateApiKey, async (req, res) => {
  printreq(req.body, "LIST MASTER SUBMENU");
  response = await callAPI(URL_COLLME, "akses/userid/submenu", req.body, {
    "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
  });
  printres(response, "LIST MASTER SUBMENU");
  res.status(200).send(response);
});

module.exports = router;
