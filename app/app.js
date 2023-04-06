const express = require("express");
const dotenv = require("dotenv");
const middlewares = require("../middlewares");
const routes = require("../routes");
const cors = require('cors')
const morgan = require("morgan");

const app = express();
dotenv.config();

app.use(cors())
morgan("dev"),
express.json()

app.get('/test', (req, res) => {
    res.status(200).json({
        msg: 'This is test'
    })
})

app.use(express.static("public"));
// app.use(middlewares);
app.use(routes);

module.exports = app;
