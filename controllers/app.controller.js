const endpointsJson = require('../endpoints.json');
const {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticle,
  insertComment,
  editArticle,
  removeComment,
  fetchAllUsers,
} = require('../models/app.model');

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  if (req.query.forceError === 'true') {
    return next(new Error('Forced server error for testing'));
  }
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch(next);
};
exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};
exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  fetchAllArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};
exports.getCommentsByArticle = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchCommentsByArticle(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
};
exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertComment(article_id, username, body)
    .then((comment) => {
      if (username === '' || body === '') {
        return Promise.reject({ status: 404, msg: 'Missing argument' });
      }
      res.status(201).send({ comment });
    })
    .catch(next);
};
exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  editArticle(article_id, inc_votes)
    .then((article) => {
      if (typeof inc_votes != 'number') {
        return Promise.reject({ status: 404, msg: 'Bad request' });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  if (isNaN(comment_id)) {
    return next({ status: 400, msg: 'Invalid comment_id' });
  }
  removeComment(comment_id)
    .then((comment) => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: 'Comment not found' });
      }
      res.status(204).send();
    })
    .catch(next);
};
exports.getUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};
