const {
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postComment,
  patchArticleById,
} = require('../controllers/app.controller');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.get('/:article_id/comments', getCommentsByArticle);
articlesRouter.post('/:article_id/comments', postComment);
articlesRouter.patch('/:article_id', patchArticleById);

module.exports = articlesRouter;
