const morgan = require("morgan");
const express = require("express");
const cors = require("cors");

const middlewares = [
    cors(),
    morgan("dev"),
    express.json()
];

module.exports = middlewares;
