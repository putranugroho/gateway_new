const express = require("express");
const router = express.Router();
const { validateApiKey } = require("../../utils/validateApiKey");
const { printreq, printres } = require("../../utils/getprint");
const { callAPI } = require("../../utils/execAPI");
const Validator = require("fastest-validator");
const { insertLog } = require("./insertlogcms");
const { route } = require("./inquiry");
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env;

router.post("/all", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "CARI SEMUA AKUN");
  response = await callAPI(CMS_URL, "akun", req.body, header);
  printres(response, "CARI SEMUA AKUN");
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

router.post("/byname", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "CARI AKUN BY NAME");
  response = await callAPI(CMS_URL, "akun/byname", req.body, header);
  printres(response, "CARI AKUN BY NAME");
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

router.post("/insert", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "INSERT AKUN IBPR");
  response = await callAPI(CMS_URL, "akun/insert", req.body, header);
  printres(response, "INSERT AKUN IBPR");
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

router.post("/update", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "CHANGE AKUN IBPR");
  response = await callAPI(CMS_URL, "akun/update", req.body, header);
  printres(response, "CHANGE AKUN IBPR");
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

router.post("/delete", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "DELETE AKUN IBPR");
  response = await callAPI(CMS_URL, "akun/delete", req.body, header);
  printres(response, "DELETE AKUN IBPR");
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

router.post("/close", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "CLOSE AKUN IBPR");
  response = await callAPI(CMS_URL, "akun/close", req.body, header);
  printres(response, "CLOSE AKUN IBPR");
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

router.post("/blokir", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "BLOKIR AKUN IBPR");
  response = await callAPI(CMS_URL, "akun/blokir", req.body, header);
  printres(response, "BLOKIR AKUN IBPR");
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

router.post("/unblokir", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "BUKA BLOKIR AKUN IBPR");
  response = await callAPI(CMS_URL, "akun/unblokir", req.body, header);
  printres(response, "BUKA BLOKIR AKUN IBPR");
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

router.post("/addcard", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { bpr_id } = req.body;
  printreq(req.body, "Tambah Kartu");
  response = await callAPI(CMS_URL, "akun/addcard", req.body, header);
  printres(response, "Tambah Kartu");
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

router.post("/validatecard", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };

  printreq(req.body, "VALIDATE CARD");
  response = await callAPI(CMS_URL, "inquiry/validatecard", req.body, header);
  printres(response, "VALIDATE CARD");

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

router.post("/updateprint", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };

  printreq(req.body, "UPDATE PRINT");
  response = await callAPI(CMS_URL, "akun/updateprint", req.body, header);
  printres(response, "UPDATE PRINT");

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

router.post("/printakun", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };

  printreq(req.body, "LIST PRINT AKUN");
  response = await callAPI(CMS_URL, "akun/printakun", req.body, header);
  printres(response, "LIST PRINT AKUN");

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

router.post("/printakunbyname", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };

  printreq(req.body, "LIST PRINT AKUN BY NAME");
  response = await callAPI(CMS_URL, "akun/printakunbyname", req.body, header);
  printres(response, "LIST PRINT AKUN BY NAME");

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

router.post("/caribyhp", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  printreq(req.body, "CARI AKUN BY NOMOR HP");
  response = await callAPI(CMS_URL, "akun/byhp", req.body, header);
  printres(response, "CARI AKUN BY NOMOR HP");
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
