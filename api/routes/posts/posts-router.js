const express = require('express');
const Posts = require('./posts-model.js');
const Joi = require('@hapi/joi');
const router = express.Router();
const axios = require('axios');
const validate = require('../auth/middleware');
require('dotenv').config();

const schema = Joi.object({
  id: Joi.string().required(),
  user_id: Joi.number(),
  platform_id: Joi.number(),
  post_text: Joi.string().required(),
  date: Joi.string().allow(''),
  screenname: Joi.string().allow(''),
});

router.get('/', (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json({ Posts: posts });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Error retrieving posts',
        Error: err,
      });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Posts.find({ id })
    .then((posts) => {
      res.status(200).json({ 'Post with specified ID': posts });
    })
    .catch((err) => {
      res.status(404).json({
        message: 'Post with specified ID not found',
        Error: err,
      });
    });
});
// GET
router.get('/:id/user', (req, res) => {
  const { id } = req.params;

  Posts.find({ user_id: id })
    .then((posts) => {
      res.status(200).json({ 'Post by specified user': posts });
    })
    .catch((err) => {
      res.status(404).json({
        message: 'Post with specified ID not found',
        Error: err,
      });
    });
});

//  POST TO GET REC TIME FROM DS -------
router.post('/:id/user', validate.validateuserid, async (req, res) => {
  const { okta_userid } = req.decodedToken;
  const { id } = req.params;

  try {
    console.log('HELLO TESTING IF I MAKE IT', id, okta_userid);
    let axx = await axios.get(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_userid}`,
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );

    console.log(axx.data.profile.twitter_screenName, 'SCREENNAME FROM OKTA');

    const postbody = {
      ...req.body,
      screenname: !axx
        ? axx.data.profile.twitter_screenName
        : `testing-${Date.now()}`,

      user_id: id,
    };

    if (Object.keys(postbody).length === 0 || schema.validate(postbody).error) {
      res.status(500).json(schema.validate(postbody).error);
    } else {
      try {
        let post = await Posts.add(postbody);
        // let ax = await axios.post(
        //   ' https://social-media-strategy-ds.herokuapp.com/recommend',
        //   post
        // );
        // console.log(ax, 'ARE YOU WORKING?');

        console.log(post, postbody, 'TESTING');
        return res.status(201).json(post);
      } catch (error) {
        console.log(error.message);
        res.status(500).json({
          message: error.message,
          error: error.stack,
          name: error.name,
          code: error.code,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.post('/quick/:id/user', (req, res) => {
  const { id } = req.params;

  const postbody = {
    ...req.body,
    screenname: 'HELLO',
    user_id: id,
  };
  Posts.add(postbody)
    .then((value) => {
      res.status(200).json(value);
    })
    .catch((err) => {
      console.log({ Error: err.message, stack: err.stack, code: err.code });
      res.status(500).json({
        message: 'Post cannot be added',
        Error: err.message,
        stack: err.stack,
        code: err.code,
      });
    });
});

// TWITTER POST --------

router.post('/:id/twitter', validate.twitterInfo, async (req, res) => {
  const { id } = req.params;
  const { okta_userid } = req.decodedToken;

  try {
    let axx = await axios.get(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_userid}`,
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );

    const postbody = {
      ...req.body,
      screenname: axx.data.profile.twitter_screenName,
      user_id: id,
    };

    if (Object.keys(postbody).length === 0 || schema.validate(postbody).error) {
      res.status(500).json(schema.validate(postbody).error);
    } else {
      if (date.length) {
        // Schedule post here
      } else {
        req.twit.post(
          'statuses/update',
          { status: req.body.post_text },
          function (err, data, response) {
            console.log(data, response, err);
          }
        );
        res.status(200).json('posted successfully');
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      title: error.title,
      code: error.code,
    });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const update = req.body;

  Posts.update(update, id) //May need to change depending on payload
    .then((value) => {
      res.status(201).json({ 'Updated post: ': value });
    })
    .catch((err) => {
      // console.log(err.message)
      res
        .status(500)
        .json({ message: 'Post cannot be updated', Error: err.message });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Posts.remove(id)
    .then((response) => {
      res.status(200).json({ message: 'Post deleted', response });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: 'Post cannot be removed', Error: err.message });
    });
});

module.exports = router;
