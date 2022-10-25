require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: `${__dirname}/../.env` });
const shopController = require('./src/controllers/shopController')
// dotenv.config({ path: "./config.env" });
console.log("process.env", process.env.DB_URL, process.env.PORT, process.env.JWT_SECRET, process.env.NODE_ENV)

const app = express();
require("./src/db/connection");
const routes = require("./src/routes");

app.use(cors());
app.use("/webhook-checkout", express.raw({ type: 'application/json' }), shopController.webhookCheckout);

app.use(express.json({ limit: "25mb" }));

app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.use(express.static("build"));
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("hi there");
  res.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
