const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

/** set router */
const cmsrouter = require('./router/cms');
const collmerouter = require('./router/collme');
const transrouter = require('./router/transaksi');
const gateway_bpr = require("./router/gateway_bpr");

const { sequelize } = require("./connection");

// sequelize
//   .authenticate()
//   .then((db) => {
//     console.log("CONNECTION ESTABLISHED! ");
//   })
//   .catch((err) => {
//     console.error("UNABLE TO ESTABLISH CONNECTION: ", err);
//   });

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/gateway_bpr", gateway_bpr);
/** set path */
app.use("/cms", cmsrouter);
app.use("/collme", collmerouter);
app.use("/trx", transrouter);

app.get("/", (req, res) => {
  res.send("Gateway-api");
});

app.listen(port, () => {
  console.log(`Gateway-API listening at http://localhost:${port}`);
});
