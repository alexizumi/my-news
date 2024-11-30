const {
  deleteComment,
  patchCommentsVotes,
} = require('../controllers/app.controller');

const commentsRouter = require('express').Router();

// DELETE /api/comments/:comment_id - delete comment
commentsRouter.delete('/:comment_id', deleteComment);
commentsRouter.patch('/:comment_id', patchCommentsVotes);

module.exports = commentsRouter;
