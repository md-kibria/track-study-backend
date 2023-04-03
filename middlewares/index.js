const morgan = require("morgan");
const express = require("express");
const cors = require("cors");

const middlewares = [
    cors({
        origin: "https://track-study-frontend.vercel.app/"
    }),
    morgan("dev"),
    express.json()
];

module.exports = middlewares;
