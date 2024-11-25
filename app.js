const express = require("express");
const getApi = require("./controllers/app.controller");

const app = express();

// GET API - Document all other endpoints available
app.get("/api", getApi);

module.exports = app;