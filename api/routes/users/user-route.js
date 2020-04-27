const express = require('express');
const router = express.Router();
const axios = require('axios');
const { validateuserid } = require('../auth/middleware');

require('dotenv').config();
const [
  joivalidation,
  joivalidationError,
  lengthcheck,
  postModels,
  find,
  add,
  UserRemove,
  UserUpdate,
] = require('../../helper'); //ARRAY IMPORTS NEED TO STAY IN ORDER

router.get('/', (req, res) => {
  find('users')
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err.message));
});
router.get('/user', (req, res) => {
  res.status(200).json(req.decodedToken);
});
router.get('/:id', (req, res) => {
  const { id } = req.params;
  find('users', { id: id })
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err.message));
});

router.delete('/:id', checkRole('admin'), validateuserid, async (req, res) => {
  const { id } = req.params;
  console.log(req.oktaid);

  try {
    let deact = await axios.post(
      `https://${process.env.OKTA_DOMAIN}/users/${req.oktaid}/lifecycle/deactivate`,
      {},
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );
    await axios.delete(
      `https://${process.env.OKTA_DOMAIN}/users/${req.oktaid}`,
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );
    let userResponse = await UserRemove('users', id);
    res.status(200).json({ message: 'User deleted', userResponse });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.stack,
      name: error.name,
      code: error.code,
    });
  }
});

router.delete('/:id/local', async (req, res) => {
  const { id } = req.params;

  try {
    let userResponse = await UserRemove('users', id);
    res.status(200).json({ message: 'User deleted', userResponse });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.stack,
      name: error.name,
      code: error.code,
    });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  if ((await lengthcheck(find('users', { id: id }))) === 0) {
    return res.status(404).json('no user found');
  } else {
    postModels(UserUpdate('users', update, id), req, res);
  }
});

function checkRole(...roles) {
  return (req, res, next) => {
    console.log(req.decodedToken);
    if (
      req.decodedToken &&
      req.decodedToken.role &&
      roles.includes(req.decodedToken.role.toLowerCase())
    ) {
      next();
    } else {
      res.status(401).json({
        message: `Don't have Authorization for this command, contact an Admin`,
      });
    }
  };
}

module.exports = router;
