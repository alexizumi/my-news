const express = require('express');
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
} = require('./controllers/app.controller');
const {
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require('./errors/app.errors');

const app = express();

app.listen(9090, () => {
  console.log('Server is running on port 9090...');
});
// GET API - Document all other endpoints available
app.get('/api', getApi);
//GET /api/topics - List all topics
app.get('/api/topics', getTopics);
//GET /api/articles/:article_id - Get article by ID
app.get('/api/articles/:article_id', getArticleById);
//GET /api/articles - Get all articles
app.get('/api/articles', getArticles);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
