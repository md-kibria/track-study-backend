const express = require("express");
const dotenv = require("dotenv");
const middlewares = require("../middlewares");
const routes = require("../routes");
const cors = require("cor")

const app = express();
dotenv.config();

app.use(cors())
app.use(express.static("public"));
app.use(middlewares);
app.use(routes);

module.exports = app;
