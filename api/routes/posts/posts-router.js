const express = require('express');
const Posts = require('./posts-model.js');
const Joi = require('@hapi/joi');
const router = express.Router();
const { oktaInfo, twitterInfo, validateuserid } = require('../auth/middleware');
const [
  joivalidation,
  joivalidationError,
  lengthcheck,
  postModels,
] = require('../../helper');
require('dotenv').config();

const schema = Joi.object({
  id: Joi.string().required(),
  user_id: Joi.number(),
  post_text: Joi.string().required(),
  date: Joi.string().allow(''),
  screenname: Joi.string().allow(''),
});
// export function postModels(modal, req, res) {
//   modal
//     .then((posts) => {
//       console.log(posts);
//       posts
//         ? res.status(200).json(posts)
//         : res.status(404).json('Nothing found');
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: error.message,
//         error: error.stack,
//         name: error.name,
//         code: error.code,
//       });
//     });
// }
// GET --------------
router.get('/', (req, res) => {
  postModels(Posts.find(), req, res);

  // Posts.find()
  //   .then((posts) => {
  //     res.status(200).json({ Posts: posts });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       message: 'Error retrieving posts',
  //       Error: err,
  //     });
  //   });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if ((await lengthcheck(Posts.find({ id: id }))) === 0) {
    return res.status(404).json('not found');
  } else {
    postModels(Posts.find({ id: req.params.id }), req, res);
  }

  // Posts.find({ id })
  //   .then((posts) => {
  //     res.status(200).json({ 'Post with specified ID': posts });
  //   })
  //   .catch((err) => {
  //     res.status(404).json({
  //       message: 'Post with specified ID not found',
  //       Error: err,
  //     });
  //   });
});
router.get('/:id/user', async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(Posts.find({ user_id: id }))) === 0) {
    return res.status(404).json('no post found');
  } else {
    postModels(Posts.find({ user_id: id }), req, res);
  }

  // Posts.find({ user_id: id })
  //   .then((posts) => {
  //     res.status(200).json({ 'Post by specified user': posts });
  //   })
  //   .catch((err) => {
  //     res.status(404).json({
  //       message: 'Post with specified ID not found',
  //       Error: err,
  //     });
  //   });
});

//  POST TO GET REC TIME FROM DS -------
router.post('/:id/user', validateuserid, oktaInfo, async (req, res) => {
  const { id } = req.params;
  //  req.okta.data  === oktainfo from middleware
  const postbody = {
    ...req.body,
    screenname: req.okta
      ? req.okta.data.profile.twitter_screenName
      : `testing-${Date.now()}`, //testing purposes
    user_id: id,
  };
  if (joivalidation(postbody, schema)) {
    res.status(500).json(joivalidationError(postbody, schema));
  } else {
    try {
      let post = await Posts.add(postbody);
      // let ax = await axios.post(
      //   ' https://social-media-strategy-ds.herokuapp.com/recommend',
      //   post
      // );
      // console.log(ax, 'ARE YOU WORKING?');
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
});

// TWITTER POST --------

router.post('/:id/twitter', twitterInfo, async (req, res) => {
  const { id } = req.params;
  try {
    const postbody = {
      ...req.body,
      screenname: req.okta.data.profile.twitter_screenName,
      user_id: id,
    };

    if (joivalidation(postbody, schema)) {
      res.status(500).json(schema.validate(postbody).error);
    } else {
      if (req.body.date) {
        console.log(req.body.date);
        // Schedule post here
      } else {
        req.twit.post(
          'statuses/update',
          { status: req.body.post_text },
          function (err, data, response) {
            // console.log(data, response, err);
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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  if ((await lengthcheck(Posts.find({ id: id }))) === 0) {
    return res.status(404).json('no post found');
  } else {
    postModels(Posts.update(update, id), req, res);
  }

  // Posts.update(update, id) //May need to change depending on payload
  //   .then((value) => {
  //     res.status(201).json({ 'Updated post: ': value });
  //   })
  //   .catch((err) => {
  //     // console.log(err.message)
  //     res
  //       .status(500)
  //       .json({ message: 'Post cannot be updated', Error: err.message });
  //   });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(Posts.find({ id: id }))) === 0) {
    return res.status(404).json('no post found');
  } else {
    postModels(Posts.remove(id), req, res);
  }

  // Posts.remove(id)
  //   .then((response) => {
  //     res.status(200).json({ message: 'Post deleted', response });
  //   })
  //   .catch((err) => {
  //     res
  //       .status(500)
  //       .json({ message: 'Post cannot be removed', Error: err.message });
  //   });
});

module.exports = router;
