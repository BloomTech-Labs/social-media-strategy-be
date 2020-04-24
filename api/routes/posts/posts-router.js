const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const { oktaInfo, twitterInfo, validateuserid } = require('../auth/middleware');
const axios = require('axios');
const [
  joivalidation,
  joivalidationError,
  lengthcheck,
  postModels,
  find,
  add,
  PostRemove,
  PostUpdate,
  findByID,
] = require('../../helper');
require('dotenv').config();
var moment = require('moment-timezone');
var schedule = require('node-schedule');

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
  postModels(find('posts'), req, res);

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

  if ((await lengthcheck(find('posts', { id: id }))) === 0) {
    return res.status(404).json('not found');
  } else {
    postModels(find('posts', { id: req.params.id }), req, res);
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
  if ((await lengthcheck(find('posts', { user_id: id }))) === 0) {
    return res.status(404).json('no post found');
  } else {
    postModels(find('posts', { user_id: id }), req, res);
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
    screenname: req.okta.data.profile.twitter_screenName || '',
    user_id: id,
  };
  if (joivalidation(postbody, schema)) {
    res.status(500).json(joivalidationError(postbody, schema));
  } else {
    try {
      let post = await add('posts', postbody);
      let ax = await axios.post(
        ' https://production-environment-flask.herokuapp.com/recommend',
        post
      );
      console.log(ax, 'ARE YOU WORKING?');
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

router.post('/:id/postnow', twitterInfo, async (req, res) => {
  const { id } = req.params;

  const postbody = {
    ...req.body,
    user_id: id,
  };

  if (joivalidation(postbody, schema)) {
    res.status(500).json(joivalidationError(postbody, schema));
  } else {
    try {
      await req.twit.post('statuses/update', { status: req.body.post_text });
      let post = await add('posts', postbody);
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

router.put('/:id/twitter', twitterInfo, async (req, res) => {
  const { id } = req.params;
  try {
    if ((await lengthcheck(find('posts', { id: id }))) === 0) {
      return res.status(404).json('no post found');
    } else {
      const update = { ...req.body, completed: true };
      let date_check = await find('posts', { id: id });
      console.log(!date_check[0].date, 'CHECK');
      if (req.body.date) {
        console.log(req.body.date, id);

        // Schedule post here
        // var a = moment.tz(`${req.body.date}`, `${req.body.tz}`);
        // console.log('DEFAULT', moment.tz.guess());

        schedule.scheduleJob(id, `${req.body.date}`, async function () {
          console.log('I WENT OUT AT', new Date());
          req.twit.post('statuses/update', {
            status: req.body.post_text,
          });
        });
        postModels(PostUpdate('posts', update, id), req, res);
      } else {
        await req.twit.post('statuses/update', { status: req.body.post_text });
        postModels(PostUpdate('posts', update, id), req, res);
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

  if ((await lengthcheck(find('posts', { id: id }))) === 0) {
    return res.status(404).json('no post found');
  } else {
    postModels(PostUpdate('posts', update, id), req, res);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(find('posts', { id: id }))) === 0) {
    return res.status(404).json('no post found');
  } else {
    let date_check = await find('posts', { id: id });
    console.log(
      date_check[0].date,
      new Date(date_check[0].date) < new Date(),
      'TEST'
    );

    if (!date_check[0].date) {
      postModels(PostRemove('posts', id), req, res);
    } else if (
      date_check[0].completed === true &&
      new Date(date_check[0].date) < new Date()
    ) {
      postModels(PostRemove('posts', id), req, res);
    } else {
      var cancel_job = schedule.scheduledJobs[id];
      cancel_job.cancel();

      postModels(PostRemove('posts', id), req, res);
    }
  }
});

module.exports = router;
