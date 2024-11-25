const db = require('../db/connection');

exports.fetchAllTopics = () => {
  const sqlQuery = `SELECT * FROM topics`;

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (articleId) => {
  console.log('Inside Model');
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
    return rows;
  });
};
