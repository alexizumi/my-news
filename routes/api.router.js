const { getApi } = require('../controllers/app.controller');
const apiRouter = require('express').Router();

apiRouter.get('/', getApi);

module.exports = apiRouter;
