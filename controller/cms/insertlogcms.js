const db = require("../../connection/index");
const fs = require("fs");
const { format } = require("date-fns");

async function insertLog(req, noreff, bpr_id) {
  const currentdate = new Date();

  sqlquery = `insert into log_cms (bpr_id,timestamp,data,noreff) values (?,?,?,?)`;
  db.sequelize.query(sqlquery, {
    replacements: [
      bpr_id,
      format(currentdate, "yyyy-MM-dd HH:mm:ss"),
      JSON.stringify(req),
      noreff,
    ],
  });
}

async function insertlogGW(bpr_id, tgl_trans, no_rek, rrn, data) {
  sqlquery = `insert into log_ppob
                (bpr_id,                    tgl_trans,                      no_rek, 
                rrn,                        data) 
                values 
                (?,                         ?,                      ?,
                ?,                          ?)`;
  db.sequelize.query(sqlquery, {
    replacements: [bpr_id, tgl_trans, no_rek, rrn, JSON.stringify(data)],
  });
}
module.exports = { insertLog, insertlogGW };
