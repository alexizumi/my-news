const { deleteComment } = require('../controllers/app.controller');

const commentsRouter = require('express').Router();

// DELETE /api/comments/:comment_id - delete comment
commentsRouter.delete('/:comment_id', deleteComment);

module.exports = commentsRouter;
