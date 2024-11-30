const {
  getUsers,
  getUserByUsername,
} = require('../controllers/app.controller');

const usersRouter = require('express').Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:username', getUserByUsername);

module.exports = usersRouter;
