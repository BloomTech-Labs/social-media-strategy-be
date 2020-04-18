const Users = require('../../routes/users/user-model');
var Twit = require('twit');
const Twitterlite = require('twitter-lite');
const axios = require('axios');

module.exports = { validateuserid, twitterInfo, oktaInfo };

function validateuserid(req, res, next) {
  const { id } = req.params;
  Users.find(id)
    .then((user) =>
      user
        ? (req.oktaid = user.okta_userid) & next()
        : res.status(400).json({ error: 'Not a Valid ID' })
    )
    .catch((err) => res.status(500).json(err.message));
}

async function twitterInfo(req, res, next) {
  const { okta_userid } = req.decodedToken;

  try {
    let ax = await axios.get(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_userid}`,
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );

    var T = new Twit({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: ax.data.profile.Oauth_token,
      access_token_secret: ax.data.profile.Oauth_secret,
    });
    req.okta = ax;
    req.twit = T;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
async function oktaInfo(req, res, next) {
  const { okta_userid } = req.decodedToken;
  console.log(okta_userid);

  try {
    let ax = await axios.get(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_userid}`,
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );

    req.okta = ax;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
