const express = require('express');
const Posts = require('./posts-model.js');
const Joi = require('@hapi/joi');
const router = express.Router();
const axios = require('axios');

const schema = Joi.object({
  user_id: Joi.number(),
  platform_id: Joi.number(),
  post_text: Joi.string().required(),
  datestamp: Joi.any(),
  topic_id: Joi.number().allow('')
});

router.get('/', (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json({ 'All posts': posts });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Error retrieving posts',
        Error: err
      });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Posts.find({ id })
    .then(posts => {
      res.status(200).json({ 'Post with specified ID': posts });
    })
    .catch(err => {
      res.status(404).json({
        message: 'Post with specified ID not found',
        Error: err
      });
    });
});

router.get('/:id/user', (req, res) => {
  const { id } = req.params;

  Posts.find({ user_id: id })
    .then(posts => {
      res.status(200).json({ 'Post by specified user': posts });
    })
    .catch(err => {
      res.status(404).json({
        message: 'Post with specified ID not found',
        Error: err
      });
    });
});

router.post('/:id/user', async (req, res) => {
  const { id } = req.params;
  const postbody = { ...req.body, user_id: id };
  if (Object.keys(postbody).length === 0 || schema.validate(postbody).error) {
    res.status(500).json(schema.validate(postbody).error);
  } else {
    try {
      let post = await Posts.add(postbody);
      // let ax = await axios.post(
      //   ' https://social-media-strategy-ds.herokuapp.com/recommand',
      //   post
      // );

      // console.log(post, ax, postbody, 'TESTING');
      return res.status(201).json(post);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error.stack,
        name: error.name,
        code: error.code
      });
    }
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const update = req.body;

  Posts.update(update, id) //May need to change depending on payload
    .then(value => {
      res.status(201).json({ 'Updated post: ': value });
    })
    .catch(err => {
      // console.log(err.message)
      res
        .status(500)
        .json({ message: 'Post cannot be updated', Error: err.message });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Posts.remove(id)
    .then(response => {
      res.status(200).json({ message: 'Post deleted', response });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'Post cannot be removed', Error: err.message });
    });
});

module.exports = router;
