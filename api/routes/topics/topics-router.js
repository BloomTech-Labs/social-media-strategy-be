const express = require('express');
const Topics = require('./topics-model.js');
const Joi = require('@hapi/joi');
const router = express.Router();
const Query = require('../../query');
const { oktaInfo, twitterInfo, validateuserid } = require('../auth/middleware');
const [
  joivalidation,
  joivalidationError,
  lengthcheck,
  topicsModels,
] = require('../../helper');

const schema = Joi.object({
  id: Joi.string(),
  user_id: Joi.string(),
  title: Joi.string().required(),
  cards: Joi.array(),
  index: Joi.any(),
});

router.get('/', (req, res) => {
  topicsModels(Topics.find(), req, res);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(Topics.find({ id }))) === 0) {
    return res.status(404).json('not found');
  } else {
    topicsModels(Topics.find({ id: req.params.id }), req, res);
  }
});

router.get('/:id/user', async (req, res) => {
  const { id } = req.params;
  const { sortby } = req.query;
  console.log(req.query);
  if ((await lengthcheck(Topics.find({ user_id: id }))) === 0) {
    return res.status(404).json('no Topics found');
  } else {
    topicsModels(Query.getTopics({ sortby }, id), req, res);
  }
});

// POST START HERE ----------------

router.post('/:id/user', (req, res) => {
  const id = req.decodedToken.okta_userid;
  const topicbody = { ...req.body, user_id: id };

  if (joivalidation(topicbody, schema)) {
    res.status(500).json(joivalidationError(topicbody, schema));
  } else {
    topicsModels(Topics.add(topicbody), req, res);
  }
});

// PUT START HERE --------------
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  if ((await lengthcheck(Topics.find({ id: id }))) === 0) {
    return res.status(404).json('no Topics found');
  } else {
    topicsModels(Topics.update(update, id), req, res);
  }
});

// DELETE START HERE ------------
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(Topics.find({ id: id }))) === 0) {
    return res.status(404).json('no Topics found');
  } else {
    topicsModels(Topics.remove(id), req, res);
  }
});

module.exports = router;
