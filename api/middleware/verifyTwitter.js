const axios = require("axios");
const Twitter = require("twit");

async function verifyTwitter(req, res, next) {
  const okta_uid = req.jwt.claims.uid;

  try {
    let ax = await axios.get(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_uid}`,
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );

    var T = new Twitter({
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

module.exports = verifyTwitter;
