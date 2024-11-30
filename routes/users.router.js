const { getUsers } = require('../controllers/app.controller');

const usersRouter = require('express').Router();

usersRouter.get('/', getUsers);

module.exports = usersRouter;
