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
  user_id: Joi.number(),
  title: Joi.string().required(),
  cards: Joi.array(),
  index: Joi.any(),
});

router.get('/', (req, res) => {
  topicsModels(Topics.find(), req, res);

  // Topics.find()
  //   .then((topics) => {
  //     res.status(200).json({ topics });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       message: 'Error retrieving Topics',
  //       Error: err,
  //     });
  //   });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(Topics.find({ id }))) === 0) {
    return res.status(404).json('not found');
  } else {
    topicsModels(Topics.find({ id: req.params.id }), req, res);
  }

  // Topics.find({ id })
  //   .first()
  //   .then((topics) => {
  //     console.log(!topics.cards.length);
  //     !topics.length
  //       ? res.status(200).json(topics)
  //       : res.json(404).json('no topic found');
  //   })
  //   .catch((err) => {
  //     res.status(404).json({
  //       message: 'topic with specified ID not found',
  //       Error: err,
  //     });
  //   });
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

  // Topics.getTopicCards(id)
  // Query.getTopics({ sortby }, id)
  //   .then((topics) => {
  //     !topics.length
  //       ? res.status(404).json('topics for this user not found')
  //       : res.status(200).json(topics);
  //   })
  //   .catch((err) => {
  //     res.status(404).json({
  //       message: 'User with specified ID not found',
  //       Error: err.message,
  //     });
  //   });
});

// POST START HERE ----------------

router.post('/:id/user', (req, res) => {
  const { id } = req.params;
  const topicbody = { ...req.body, user_id: id };
  console.log(req.body);

  if (joivalidation(topicbody, schema)) {
    res.status(500).json(joivalidationError(topicbody, schema));
  } else {
    topicsModels(Topics.add(topicbody), req, res);
  }
  // Topics.add(req.body) //May need to change depending on payload
  //   .then((value) => {
  //     res.status(200).json(value);
  //   })
  //   .catch((err) => {
  //     console.log({ Error: err.message, stack: err.stack, code: err.code });
  //     res.status(500).json({
  //       message: 'topic cannot be added',
  //       Error: err.message,
  //       stack: err.stack,
  //       code: err.code,
  //     });
  // });
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
  // Topics.update(update, id)
  //   .then((value) => {
  //     res.status(201).json({ value });
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //     res.status(500).json({
  //       message: 'Topic cannot be updated',
  //       Error: err.message,
  //       code: err.code,
  //       stack: err.stack,
  //     });
  //   });
});

// DELETE START HERE ------------
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(Topics.find({ id: id }))) === 0) {
    return res.status(404).json('no Topics found');
  } else {
    topicsModels(Topics.remove(id), req, res);
  }

  // Topics.remove(id)
  //   .then((response) => {
  //     res.status(200).json({ message: 'Topic deleted', response });
  //   })
  //   .catch((err) => {
  //     res
  //       .status(500)
  //       .json({ message: 'Topic cannot be removed', Error: err.message });
  //   });
});

module.exports = router;
