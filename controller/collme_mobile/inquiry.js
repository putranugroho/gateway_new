const { convertmicrotime } = require("../../utils/converttime");
const { callAPI } = require("../../utils/execAPI");
const { printreq, printres } = require("../../utils/getprint");
const { insertlog } = require("../../utils/log_collme");
require("dotenv").config();
const { URL_COLLME } = process.env;

async function inquiry(req) {
  const { trx_code, bpr_id, noreff, tgl_trans } = req;
  console.log(tgl_trans);

  const trxMessages = {
    "0150": "INQUIRY AKUN KOLEKTOR",
    "0300": "INQUIRY SALDO TABUNGAN VIA KOLEKTOR",
    "0333": "INQUIRY SALDO KOLEKTOR",
    "0330": "INQUIRY OS KREDIT VIA KOLEKTOR",
    "0331": "INQUIRY OS KREDIT BY TANGGAL VIA KOLEKTOR",
    "0332": "INQUIRY OS KREDIT BY BULAN VIA KOLEKTOR",
    5101: "TRANSAKSI PEMBAYARAN VIA TABUNGAN DI KOLEKTOR",
    4700: "GET SETELMENT KOLEKTOR",
  };

  var response;

  if (trxMessages[trx_code]) {
    try {
      response = await callAPI(URL_COLLME, "gw", req, {
        "x-api-key": "X0pQMBDSo2DAarIgOQrbm/N/UySKrbPeo3QbnZkKD7M=",
      });
    } catch (error) {
      response = {
        pcode: "000",
        rcode: "099",
        status: "fail",
        message: "The server is busy, please try again later",
      };
    }

    const microtimeValue = parseInt(tgl_trans);
    const timestampString = convertmicrotime(microtimeValue);

    printreq(req, trxMessages[trx_code]);
    var nohp;
    const datalog = { Request: req, Response: response };
    if (typeof nohp == "undefined") {
      nohp = "";
    }
    insertlog(nohp, bpr_id, timestampString, noreff, JSON.stringify(datalog));
  } else {
    response = {
      pcode: "000",
      rcode: "099",
      status: "fail",
      message: "Unknown Transaction Code",
    };
  }

  printres(response, trxMessages[trx_code]);
  return response;
}

module.exports = { inquiry };
