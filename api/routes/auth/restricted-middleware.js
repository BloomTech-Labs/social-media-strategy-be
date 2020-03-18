const jwt = require('jsonwebtoken'); // <<< install this npm package

const { jwtSecret } = require('../../config/secrets');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    jwt.verify(authorization, jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'Invalid Credentials' });
      } else {
        req.decodedToken = decodedToken;

        next();
      }
    });
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
};
