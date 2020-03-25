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

router.get('/:id/test', validateuserid, async (req, res) => {
  console.log(req.oktaid, 'CHECKING ID');

  try {
    let twit = await client.getRequestToken(
      'https://post-route-feature.herokuapp.com/api/auth/verify'
    );

    let ax = axios.post(
      `https://dev-966011.okta.com/api/v1/users/${req.oktaid}`,
      {
        profile: {
          Oauth_token: twit.oauth_token,
          Oauth_secret: twit.oauth_token_secret
        }
      },
      {
        headers: {
          Authorization: process.env.OKTA_AUTH
        }
      }
    );

    console.log(ax, 'POST TO OKTA');

    res.status(200).json({
      reqTkn: twit.oauth_token,
      reqTknSecret: twit.oauth_token_secret
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/verify', (req, res) => {
  console.log(req.query, 'TESTING OAUTH');
  res.status(200).json({ message: req.query });
});

router.post('/register', async (req, res) => {
  let user = req.body;

  let newuser = schema.validate(user).value;
  if (!schema.validate(user).error) {
    try {
      const hash = bcrypt.hashSync(newuser.password, 10);
      newuser.password = hash;

      let ax = await axios.post(
        'https://dev-966011.okta.com/api/v1/users?activate=true',
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
    email: user.email
  };
  const options = {
    expiresIn: '1d' // probably change for shorter time, esp if doing refresh tokens
  };

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
