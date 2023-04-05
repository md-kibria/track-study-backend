const express = require("express");
const dotenv = require("dotenv");
const middlewares = require("../middlewares");
const routes = require("../routes");

const app = express();
dotenv.config();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")
    next()
})

app.use(express.static("public"));
app.use(middlewares);
app.use(routes);

module.exports = app;
