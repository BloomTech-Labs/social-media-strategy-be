const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets');
const router = express.Router();
const Users = require('../users/user-Modal');
const Joi = require('@hapi/joi');

const schema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required()
    .min(1)
    .max(30)
});


router.post('/register', (req, res) => {
  let user = req.body;

  let newuser = schema.validate(user).value;
  if (!schema.validate(user).error) {
    const hash = bcrypt.hashSync(newuser.password, 10);
    newuser.password = hash;

    Users.add(newuser)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error.message);
      });
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
        const token = generateToken(user);

        res.status(200).json({
          message: 'Login successful',
          token
        });
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
