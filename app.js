const express = require('express');
const { getApi, getTopics } = require('./controllers/app.controller');
const {
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require('./errors/app.errors');

const app = express();

// GET API - Document all other endpoints available
app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
