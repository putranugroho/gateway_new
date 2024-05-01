const express = require("express");
const router = express.Router();
const { validateApiKey } = require("../../utils/validateApiKey");
const { printreq, printres } = require("../../utils/getprint");
const { callAPI } = require("../../utils/execAPI");
const Validator = require("fastest-validator");
const { insertLog } = require("./insertlogcms");
const v = new Validator();
const { CMS_URL, API_KEY_CMS } = process.env;

router.post("/login", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  var { noreff, bpr_id } = req.body;
  printreq(req.body, "login");
  response = await callAPI(CMS_URL, "userid/login", req.body, header);
  printres(response, "login");
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

router.post("/logout", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  printreq(req.body, "Logout");
  response = await callAPI(CMS_URL, "userid/updatests", req.body, header);
  printres(response, "Logout");

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

router.post("/mastermenu", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  printreq(req.body, "GET ALL MASTER FASILITAS");
  response = await callAPI(CMS_URL, "fasilitas-akses", req.body, header);
  printres(response, "GET ALL MASTER FASILITAS");

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

router.post("/fasilitasakses", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  printreq(req.body, "GET FASILITAS AKSES BY USER");
  response = await callAPI(CMS_URL, "fasilitas-akses/byuser", req.body, header);
  printres(response, "GET FASILITAS AKSES BY USER");

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

router.post("/listalluser", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  printreq(req.body, "GET LIST ALL USER ID");
  response = await callAPI(CMS_URL, "userid", req.body, header);
  printres(response, "GET LIST ALL USER ID");

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
  printreq(req.body, "GET LIST USER ID BY NAME");
  response = await callAPI(CMS_URL, "userid/byname", req.body, header);
  printres(response, "GET LIST USER ID BY NAME");

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

router.post("/byuserid", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  printreq(req.body, "GET LIST USER ID BY USERID");
  response = await callAPI(CMS_URL, "userid/byuser", req.body, header);
  printres(response, "GET LIST USER ID BY USERID");

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
  printreq(req.body, "INSERT USER ID");
  response = await callAPI(CMS_URL, "userid/insert", req.body, header);
  printres(response, "INSERT USER ID");

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
  printreq(req.body, "UPDATE USER ID");
  response = await callAPI(CMS_URL, "userid/update", req.body, header);
  printres(response, "UPDATE USER ID");

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
  printreq(req.body, "DELETE USER ID");
  response = await callAPI(CMS_URL, "userid/delete", req.body, header);
  printres(response, "DELETE USER ID");

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

router.post("/chgpass", validateApiKey, async (req, res) => {
  let response = {};
  let header = {
    "api-key": API_KEY_CMS,
  };
  printreq(req.body, "GANTI PASSWORD USER ID");

  response = await callAPI(CMS_URL, "userid/chgpass", req.body, header);
  printres(response, "GANTI PASSWORD USER ID");

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
