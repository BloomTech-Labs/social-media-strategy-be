const express = require('express');
const Platforms = require('./platforms-model.js');
const Joi = require('@hapi/joi');
const router = express.Router();

const schema = Joi.object({
  user_id: Joi.number(),
  platform: Joi.string().required()
});

router.get('/', (req, res) => {
  Platforms.find()
    .then(platforms => {
      res.status(200).json({ 'All platforms': platforms });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Error retrieving platforms',
        Error: err
      });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Platforms.find({ id })
    .then(platforms => {
      res.status(200).json({ 'Platform with specified ID': platforms });
    })
    .catch(err => {
      res.status(404).json({
        message: 'Platform with specified ID not found',
        Error: err
      });
    });
});

router.get('/:id/user', (req, res) => {
  const { id } = req.params;

  Platforms.find({ user_id: id })
    .then(platforms => {
      res.status(200).json({ 'Platform by specified user': platforms });
    })
    .catch(err => {
      res.status(404).json({
        message: 'Platform with specified ID not found',
        Error: err
      });
    });
});

router.post('/:id/user', (req, res) => {
  const { id } = req.params;
  const platformbody = { ...req.body, user_id: id };
  if (Object.keys(platformbody).length === 0 || schema.validate(platformbody).error) {
    res.status(500).json(schema.validate(platformbody).error);
  } else {
    Platforms.add(platformbody) //May need to change depending on payload
      .then(value => {
        res.status(200).json({ 'Added platform: ': value });
      })
      .catch(err => {
        console.log('HELLO platformS');
        res.status(500).json({
          message: 'Platform cannot be added',
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

  Platforms.update(update, id) //May need to change depending on payload
    .then(value => {
      res.status(201).json({ 'Updated platform: ': value });
    })
    .catch(err => {
      // console.log(err.message)
      res
        .status(500)
        .json({ message: 'platform cannot be updated', Error: err.message });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Platforms.remove(id)
    .then(response => {
      res.status(200).json({ message: 'platform deleted', response });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'platform cannot be removed', Error: err.message });
    });
});

module.exports = router;
