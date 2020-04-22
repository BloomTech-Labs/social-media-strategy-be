require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets');
const router = express.Router();
const Joi = require('@hapi/joi');
const axios = require('axios');
const Twitterlite = require('twitter-lite');
const { validateuserid, twitterInfo, oktaInfo } = require('../auth/middleware');
const restricted = require('../auth/restricted-middleware');
const queryString = require('query-string');
var moment = require('moment-timezone');
var schedule = require('node-schedule');
var Twit = require('twit');
const [
  joivalidation,
  joivalidationError,
  lengthcheck,
  postModels,
  find,
  add,
  UserRemove,
  UserUpdate,
  findByID,
] = require('../../helper');

const client = new Twitterlite({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
});

const dsSchema = Joi.object({
  email: Joi.string().email().required().valid('ds10@lasersharks.com'),
  password: Joi.string().required().min(4).max(30).valid('krahs'),
  okta_userid: Joi.string().default('DS have no Okta'),
  role: Joi.string().empty('').default('admin'),
});

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(4).max(30),
  okta_userid: Joi.string(),
  role: Joi.string().empty('').default('user'),
});

router.get('/:id/oauth', validateuserid, async (req, res, next) => {
  try {
    let twit = await client.getRequestToken('https://www.so-me.net/callback ');
    // https://master.duosa5dkjv93b.amplifyapp.com/callback     <-- if so-me in not fixed

    const redirecturl = `https://api.twitter.com/oauth/authorize?oauth_token=${twit.oauth_token}`;

    res.status(200).json(redirecturl);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post('/:id/callback', restricted, async (req, res, next) => {
  const { okta_userid } = req.decodedToken;

  try {
    let twitaccess = await axios.post(
      `https://api.twitter.com/oauth/access_token${req.body.location.search}`
    );
    // PARSE DATA OF TWITTER AXIOS CALL
    const parsed_data = queryString.parse(twitaccess.data);

    // Sends Okta user profile Oauth information
    let ax = await axios.post(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_userid}`,
      {
        profile: {
          Oauth_token: parsed_data.oauth_token,
          Oauth_secret: parsed_data.oauth_token_secret,
          twitter_userId: parsed_data.user_id,
          twitter_screenName: parsed_data.screen_name,
          oauth_verifier: req.body.parse.oauth_verifier,
        },
      },
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );
    // let followers = '';

    var T = new Twit({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: parsed_data.oauth_token,
      access_token_secret: parsed_data.oauth_token_secret,
    });
    let a = await T.get('followers/ids', {
      screen_name: `${parsed_data.screen_name}`,
    });
    let totalfollowers = await a.data.ids.length;

    res.status(200).json({
      twitter_screenName: parsed_data.screen_name,
      total_followers: totalfollowers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.stack,
      name: error.name,
      code: error.code,
    });
  }
});

router.post('/register', async (req, res) => {
  let user = req.body;

  let newuser = schema.validate(user).value;
  if (!schema.validate(user).error) {
    try {
      const hash = bcrypt.hashSync(newuser.password, 10);
      newuser.password = hash;

      let ax = await axios.post(
        `https://${process.env.OKTA_DOMAIN}/users?activate=true`,
        {
          profile: {
            email: req.body.email,
            login: req.body.email,
          },
          credentials: {
            password: { value: req.body.password },
          },
        },
        {
          headers: {
            Authorization: process.env.OKTA_AUTH,
          },
        }
      );

      newuser.okta_userid = ax.data.id;
      let saved = await add('users', newuser);

      let tokenuser = await find('users', { email: req.body.email }).first();
      const token = generateToken(tokenuser);

      res.status(201).json({ user: tokenuser, token });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error.stack,
        name: error.name,
        code: error.code,
      });
    }
  } else {
    res.status(500).json(schema.validate(user).error);
  }
});

router.post('/login', (req, res) => {
  let { email, password } = req.body;

  find('users', { email })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        try {
          const token = generateToken(user);
          res.status(200).json({
            message: 'Login successful',
            token,
          });
        } catch (error) {
          res.status(500).json({
            message: error.message,
            error: error.stack,
            name: error.name,
            code: error.code,
          });
        }
      } else {
        res.status(500).json({ error: 'login error' });
      }
    })
    .catch((err) => res.status(500).json(err.message));
});

// DS LOGIN
router.post('/dsteam', async (req, res) => {
  let { email, password } = req.body;

  let user = await find('users', { email }).first();

  if (!user && !dsSchema.validate(req.body).error) {
    try {
      let usr = dsSchema.validate({ email, password }).value;

      const hash = bcrypt.hashSync(usr.password, 10);

      usr.password = hash;

      let saved = await add('users', usr);
      let newuser = await find('users', { email }).first();

      const token = generateDSToken(newuser);
      res.status(200).json({
        message: 'Register & Login successful',
        token,
      });
    } catch (error) {
      res
        .status(500)
        .json('Wrong credentials or is req.body is in wrong format');
    }
  } else if (!dsSchema.validate(req.body).error) {
    try {
      const token = generateDSToken(user);
      res.status(200).json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      res
        .status(500)
        .json('Wrong credentials or is req.body is in wrong format');
    }
  } else {
    res.status(401).json('Wrong Ds_Team credentials provided');
  }
});

// TOKEN FUNCTIONS

function generateToken(user) {
  const payload = {
    subject: user.id,
    email: user.email,
    okta_userid: user.okta_userid,
    role: user.role,
  };

  if (user.role === 'admin') {
    console.log(user.role);
    const options = {
      expiresIn: '30d',
    };
    return jwt.sign(payload, jwtSecret, options);
  } else {
    const options = {
      expiresIn: '1d', // probably change for shorter time, esp if doing refresh tokens
    };
    return jwt.sign(payload, jwtSecret, options);
  }

  // const options = {
  //   expiresIn: "1d", // probably change for shorter time, esp if doing refresh tokens
  // };
}
function generateDSToken(user) {
  const payload = {
    subject: user.id,
    email: user.email,
    okta_userid: user.okta_userid,
    role: user.role,
  };
  const options = {
    expiresIn: '30d', // probably change for shorter time, esp if doing refresh tokens
  };

  return jwt.sign(payload, jwtSecret, options);
}

router.get('/userInfo', restricted, twitterInfo, async (req, res) => {
  try {
    let twitInfo = await req.twit.get('users/show', {
      screen_name: `${req.okta.data.profile.twitter_screenName}`,
    });

    // console.log('USERRS/SHOW', twitInfo);

    res.status(200).json({
      screen_name: req.okta.data.profile.twitter_screenName,
      total_followers: twitInfo.data.followers_count,
      total_following: twitInfo.data.friends_count,
      total_post: twitInfo.data.statuses_count,
      profile_img: twitInfo.data.profile_image_url_https,
      location: twitInfo.data.location,
      name: twitInfo.data.name,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/userStream', restricted, twitterInfo, async (req, res) => {
  console.log('SCREENY', req.okta.data.profile.twitter_screenName)
  try {
    let twitInfo = await req.twit.get('statuses/home_timeline/:count', 
    {
      screen_name: `${req.okta.data.profile.twitter_screenName}`,
      count: 1 
    });

    // console.log('STREAMMY', twitInfo.data);
  
    // res.end();
    res.status(200).json({stream_data: twitInfo.data});
  } catch (error) {
    console.log(error);
  }
});

// Twitter post -----
// router.get('/:id/twitpost', restricted, async (req, res) => {
//   const { okta_userid } = req.decodedToken;

//   let ax = await axios.get(
//     `https://${process.env.OKTA_DOMAIN}/users/${okta_userid}`,
//     {
//       headers: {
//         Authorization: process.env.OKTA_AUTH,
//       },
//     }
//   );

//   // console.log(ax.data.profile, 'Axios call');

//   var T = new Twit({
//     consumer_key: process.env.CONSUMER_KEY,
//     consumer_secret: process.env.CONSUMER_SECRET,
//     access_token: ax.data.profile.Oauth_token,
//     access_token_secret: ax.data.profile.Oauth_secret,
//   });

//   T.post('statuses/update', { status: 'Web > DS!!!!!!' }, function (
//     err,
//     data,
//     response
//   ) {
//     console.log(data);
//   });
//   res.status(200).json('success');
// });

// TEST CRON

router.post('/test', (req, res) => {
  // FORMAT for : "date":"2020-04-07 00:29",  "tz":"America/New_York",
  var a = moment.tz(`${req.body.date}`, `${req.body.tz}`);
  console.log('DEFAULT', moment.tz.guess());

  schedule.scheduleJob(`${a}`, function () {
    console.log(
      'The answer to life, the universe, and everything!',
      new Date(),
      req.body.test
    );
  });
  res.status(201).json({ message: 'testing' });
});

router.get('/userInfo', (req, res) => {

})

module.exports = router;
