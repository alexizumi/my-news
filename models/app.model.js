const db = require('../db/connection');

exports.fetchAllTopics = () => {
  let sqlQuery = `SELECT * FROM topics`;

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};
