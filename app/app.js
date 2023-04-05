const express = require("express");
const dotenv = require("dotenv");
const middlewares = require("../middlewares");
const routes = require("../routes");

const app = express();
dotenv.config();

app.use(express.static("public"));
app.use(middlewares);
app.use(routes);

module.exports = app;
