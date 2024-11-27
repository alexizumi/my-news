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
    return rows;
  });
};
exports.fetchCommentsByArticle = (article_id) => {
  const sqlQuery = `
  SELECT * FROM comments 
  WHERE article_id = $1
  ORDER BY comments.created_at DESC;`;
  return db.query(sqlQuery, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Article not found' });
    }
    return rows;
  });
};
exports.insertComment = (article_id, username, commentBody) => {
  const sqlQuery = `
  INSERT INTO comments (article_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  return db
    .query(sqlQuery, [article_id, username, commentBody])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return rows;
    });
};
exports.editArticle = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return rows;
    });
};
