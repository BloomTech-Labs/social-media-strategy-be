require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets');
const router = express.Router();
const Users = require('../users/user-model');
const Joi = require('@hapi/joi');
const axios = require('axios');
const Twitterlite = require('twitter-lite');
const { validateuserid } = require('../auth/middleware');
const restricted = require('../auth/restricted-middleware');
const queryString = require('query-string');
var Twit = require('twit');
const cors = require('cors');

const corsOptions = {
  origin: '*'
};

const client = new Twitterlite({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET
});

const schema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required()
    .min(4)
    .max(30),
  okta_userid: Joi.string()
});

function corssolve(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.set('Access-Control-Allow-Origin', '*');
  // if (isPreflight(req)) {
  //   res.set('Access-Control-Allow-Methods', 'GET'); // Add this!
  //   res.status(204).end();
  //   return;
  // }

  next();
}

router.get(
  '/:id/oauth',
  validateuserid,
  cors(corsOptions),
  corssolve,
  async (req, res, next) => {
    console.log(req.oktaid, 'CHECKING ID');

    try {
      let twit = await client.getRequestToken(
        'https://mddcab.jrivera6869.now.sh/callback'
      );

      const redirecturl = `https://api.twitter.com/oauth/authorize?oauth_token=${twit.oauth_token}`;
      // const redirecturl = `https://wwww.google.com`;

      res.redirect(redirecturl);
      next();
      res.status(200).json({ message: 'success' });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

router.post('/:id/callback', restricted, async (req, res) => {
  const { okta_userid } = req.decodedToken;
  console.log(okta_userid, 'REQQ');

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
          oauth_verifier: req.body.parse.oauth_verifier
        }
      },
      {
        headers: {
          Authorization: process.env.OKTA_AUTH
        }
      }
    );

    res.status(200).json({ message: req.body });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.stack,
      name: error.name,
      code: error.code
    });
  }
});

// console.log(twitaccess);
// console.log({
//   accTkn: parsed_data.oauth_token,
//   accTknSecret: parsed_data.oauth_token_secret,
//   userId: parsed_data.user_id,
//   screenName: parsed_data.screen_name
// });
// // console.log(ax);
// console.log(req.body.location.search, 'BODDY');

// console.log({
//   message: error.message,
//   error: error.stack,
//   name: error.name,
//   code: error.code
// });

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
            login: req.body.email
          },
          credentials: {
            password: { value: req.body.password }
          }
        },
        {
          headers: {
            Authorization: process.env.OKTA_AUTH
          }
        }
      );

      newuser.okta_userid = ax.data.id;
      let saved = await Users.add(newuser);

      console.log(ax.data.id, 'testing');
      res.status(201).json(saved);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error.stack,
        name: error.name,
        code: error.code
      });
    }
  } else {
    res.status(500).json(schema.validate(user).error);
  }
});

router.post('/login', (req, res) => {
  let { email, password } = req.body;

  Users.findBy({ email })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        try {
          const token = generateToken(user);
          res.status(200).json({
            message: 'Login successful',
            token
          });
        } catch (error) {
          res.status(500).json({
            message: error.message,
            error: error.stack,
            name: error.name,
            code: error.code
          });
        }
      } else {
        res.status(500).json({ error: 'login error' });
      }
    })
    .catch(err => res.status(500).json(err.message));
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    email: user.email,
    okta_userid: user.okta_userid
  };
  const options = {
    expiresIn: '1d' // probably change for shorter time, esp if doing refresh tokens
  };

  return jwt.sign(payload, jwtSecret, options);
}

// Twitter post -----
router.get('/:id/twitpost', restricted, async (req, res) => {
  const { okta_userid } = req.decodedToken;

  let ax = await axios.get(
    `https://${process.env.OKTA_DOMAIN}/users/${okta_userid}`,
    {
      headers: {
        Authorization: process.env.OKTA_AUTH
      }
    }
  );

  console.log(ax.data.profile, 'Axios call');

  var T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: ax.data.profile.Oauth_token,
    access_token_secret: ax.data.profile.Oauth_secret
  });

  T.post('statuses/update', { status: 'Web > DS!!!!!!' }, function(
    err,
    data,
    response
  ) {
    console.log(data);
  });
  res.status(200).json('success');
});

module.exports = router;
