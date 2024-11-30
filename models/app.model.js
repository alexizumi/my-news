const db = require('../db/connection');

exports.fetchAllTopics = () => {
  const sqlQuery = `SELECT * FROM topics`;
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (articleId) => {
  const sqlQuery = `SELECT articles.article_id,
    articles.author,
    articles.title,
    articles.body,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id `;
  return db.query(sqlQuery, [articleId]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Article not found' });
    }
    return rows;
  });
};

exports.fetchAllArticles = (
  sort_by = 'created_at',
  order = 'DESC',
  topic = ''
) => {
  const validSortBy = [
    'article_id',
    'created_at',
    'title',
    'topic',
    'author',
    'votes',
  ];
  const validOrder = ['ASC', 'DESC'];
  sort_by = sort_by.toLowerCase();
  order = order.toUpperCase();

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  let sqlQuery = `
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
  `;
  let sqlResult;
  if (topic) {
    sqlQuery += `WHERE topic = $1
                 GROUP BY articles.article_id
                 ORDER BY ${sort_by} ${order};`;
    sqlResult = db.query(sqlQuery, [topic]);
  } else {
    sqlQuery += `
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};`;
    sqlResult = db.query(sqlQuery);
  }

  return sqlResult.then(({ rows }) => {
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
      const article = rows[0];
      return article;
    });
};
exports.removeComment = (comment_id) => {
  const sqlQuery = `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `;
  return db.query(sqlQuery, [comment_id]).then(({ rows }) => rows);
};
exports.fetchAllUsers = () => {
  const sqlQuery = `
  SELECT * FROM users;
  `;
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};
exports.fetchUserByUsername = (username) => {
  sqlQuery = `
  SELECT users.username, users.name , users.avatar_url 
  FROM users
  WHERE users.username = $1
  `;
  return db.query(sqlQuery, [username]).then(({ rows }) => {
    return rows;
  });
};
