const express = require("express");
const router = express.Router();
require("dotenv").config;
const { validateApiKey } = require("../../utils/validateApiKey");
const { transaksi } = require("./transaksi");
const { aktivasi } = require("./aktivasi");
const { inquiry } = require("./inquiry");

router.post("/transaksi", validateApiKey, async (req, res) => {
  response = await transaksi(req.body);
  res.status(200).send(response);
});

router.post("/aktivasi", validateApiKey, async (req, res) => {
  response = await aktivasi(req.body);
  res.status(200).send(response);
});

router.post("/inquiry", validateApiKey, async (req, res) => {
  response = await inquiry(req.body);
  res.status(200).send(response);
});

module.exports = router;
