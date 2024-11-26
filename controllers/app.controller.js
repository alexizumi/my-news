const endpointsJson = require('../endpoints.json');
const {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
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
  //   console.log('Inside controller');
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};
