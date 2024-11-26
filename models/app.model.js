const db = require('../db/connection');

exports.fetchAllTopics = () => {
  const sqlQuery = `SELECT * FROM topics`;

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (articleId) => {
  const sqlQuery = `SELECT article_id,
    author,
    title,
    body,
    topic,
    created_at,
    votes,
    article_img_url FROM articles
    WHERE article_id = $1 `;
  return db.query(sqlQuery, [articleId]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Article not found' });
    }
    return rows;
  });
};
