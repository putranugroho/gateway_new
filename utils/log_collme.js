const db = require('../connection');

async function insertlog(nohp, bpr_id, timestamp, noreff, data) {
    const sqlquery = `INSERT INTO log_collme (nohp, bpr_id, timestamp, noreff, data) 
    VALUES (?, ?, ?, ?, ?)`;

    await db.sequelize.query(sqlquery, {
        replacements: [nohp, bpr_id, timestamp, noreff, data],
        type: db.sequelize.QueryTypes.INSERT
    });
}

module.exports = { insertlog };
