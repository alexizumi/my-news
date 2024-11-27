const express = require('express');
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticle,
  postComment,
  patchArticleById,
} = require('./controllers/app.controller');
const {
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require('./errors/app.errors');

const app = express();
app.use(express.json());

// app.listen(9090, () => {
//   console.log('Server is running on port 9090...');
// });
// GET API - Document all other endpoints available
app.get('/api', getApi);
//GET /api/topics - List all topics
app.get('/api/topics', getTopics);
//GET /api/articles/:article_id - Get article by ID
app.get('/api/articles/:article_id', getArticleById);
//GET /api/articles - Get all articles
app.get('/api/articles', getArticles);
// Get comments by article
app.get('/api/articles/:article_id/comments', getCommentsByArticle);
// POST comment in article
app.post('/api/articles/:article_id/comments', postComment);
//PATCH /api/articles/:article_id - Update article votes
app.patch('/api/articles/:article_id', patchArticleById);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
