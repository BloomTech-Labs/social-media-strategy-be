const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets');
const router = express.Router();
const Users = require('../users/user-model');
const Joi = require('@hapi/joi');
const axios = require('axios');

const schema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required()
    .min(1)
    .max(30)
});

router.post('/register', async (req, res) => {
  let user = req.body;

  let newuser = schema.validate(user).value;
  if (!schema.validate(user).error) {
    try {
      const hash = bcrypt.hashSync(newuser.password, 10);
      newuser.password = hash;

      let saved = await Users.add(newuser);
      res.status(201).json(saved);

      // let ax = await axios.post(
      //   'https://dev-966011.okta.com/api/v1/users?activate=true',
      //   {
      //     profile: {
      //       email: email,
      //       login: email
      //     }
      //   },
      //   {
      //     headers: {
      //       Authorization: '007i8tncM4Z-bN6fiP6fvu0AbKS-tvql3lFtxy-6vd'
      //     }
      //   }
      // );
      // console.log(ax, 'testing');
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error.stack,
        name: error.name,
        code: error.code
      });
    }

    // Users.add(newuser)
    //   .then(saved => {
    //     res.status(201).json(saved);
    //   })
    //   .catch(error => {
    //     res.status(500).json(error.message);
    //   });
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
