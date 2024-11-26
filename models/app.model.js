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
exports.fetchAllArticles = () => {
  const sqlQuery = `
    SELECT 
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(comments.comment_id) AS INT) AS comments_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC; `;

  return db.query(sqlQuery).then(({ rows }) => {
    console.log(rows, 'rows inside model');
    return rows;
  });
};
exports.fetchCommentsById = (article_id) => {
  const sqlQuery = `SELECT * comments `;
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};
