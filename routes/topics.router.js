const { getTopics } = require('../controllers/app.controller');

const topicsRouter = require('express').Router();

//GET /api/topics - List all topics
topicsRouter.get('/', getTopics);

module.exports = topicsRouter;
