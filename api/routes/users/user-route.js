const express = require('express');
const router = express.Router();
const User = require('../users/user-model');

router.get('/', (req, res) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err.message));
});
router.get('/user', (req, res) => {
  res.status(200).json(req.decodedToken);
});

module.exports = router;
