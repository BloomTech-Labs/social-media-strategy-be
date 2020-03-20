const express = require('express');
const Topics = require('./topics-model.js');
const Joi = require('@hapi/joi');
const router = express.Router();

const schema = Joi.object({
  user_id: Joi.number(),
  name: Joi.string().required()
});

router.get('/', (req, res) => {
  Topics.find()
    .then(topics => {
      res.status(200).json({ 'All topics': topics });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Error retrieving Topics',
        Error: err
      });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Topics.find({ id })
    .then(topics => {
      res.status(200).json({ 'topic with specified ID': topics });
    })
    .catch(err => {
      res.status(404).json({
        message: 'topic with specified ID not found',
        Error: err
      });
    });
});

router.get('/:id/user', (req, res) => {
  const { id } = req.params;

  Topics.find({ user_id: id })
    .then(topics => {
      res.status(200).json({ 'Topic by specified user': topics });
    })
    .catch(err => {
      res.status(404).json({
        message: 'topic with specified ID not found',
        Error: err
      });
    });
});

router.post('/:id/user', (req, res) => {
  const { id } = req.params;
  const topicbody = { ...req.body, user_id: id };
  if (Object.keys(topicbody).length === 0 || schema.validate(topicbody).error) {
    res.status(500).json(schema.validate(topicbody).error);
  } else {
    Topics.add(topicbody) //May need to change depending on payload
      .then(value => {
        res.status(200).json({ 'Added topic: ': value });
      })
      .catch(err => {
        console.log('HELLO TOPICS');
        res.status(500).json({
          message: 'topic cannot be added',
          Error: err.message,
          stack: err.stack,
          code: err.code
        });
      });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const update = req.body;

  Topics.update(update, id) //May need to change depending on payload
    .then(value => {
      res.status(201).json({ 'Updated topic: ': value });
    })
    .catch(err => {
      // console.log(err.message)
      res
        .status(500)
        .json({ message: 'Topic cannot be updated', Error: err.message });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Topics.remove(id)
    .then(response => {
      res.status(200).json({ message: 'Topic deleted', response });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'Topic cannot be removed', Error: err.message });
    });
});

module.exports = router;
