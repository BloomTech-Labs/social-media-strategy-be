const express = require('express');
const router = express.Router();
const User = require('../users/user-Modal');

router.get('/', (req, res) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err.message));
});

module.exports = router;
