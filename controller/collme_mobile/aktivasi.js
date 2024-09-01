const { convertmicrotime } = require("../../utils/converttime");
const { callAPI } = require("../../utils/execAPI");
const { printreq, printres } = require("../../utils/getprint");
const { insertlog } = require("../../utils/log_collme");
require("dotenv").config();
const { URL_COLLME } = process.env;

async function aktivasi(req) {
  const { trx_code, bpr_id, nohp, noreff, tgl_trans } = req;
  console.log(tgl_trans);

  const trxMessages = {
    7600: "AKTIVASI KOLEKTOR",
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

    const datalog = { Request: req, Response: response };
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

module.exports = { aktivasi };
