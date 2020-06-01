require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Twitter = require("twitter-lite");
const queryString = require("query-string");

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
});

router.get("/twitter/authorize", async (req, res, next) => {
  const callbackURL = `${process.env.APP_URL}/connect/twitter/callback`;

  try {
    const oauthResponse = await client.getRequestToken(callbackURL);
    const redirecturl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauthResponse.oauth_token}`;

    res.status(200).json(redirecturl);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/twitter/callback", async (req, res, next) => {
  const okta_uid = req.jwt.claims.uid;
  const { oauth_token, oauth_verifier } = req.body;

  const parsed = await axios
    .post(
      `https://api.twitter.com/oauth/access_token?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`
    )
    .then(({ data }) => queryString.parse(data))
    .catch((err) => console.error(err));

  if (!parsed)
    return next({
      code: 500,
      message: "There was a problem connecting your Twitter account",
    });

  // Sends Okta user profile Oauth information
  await axios
    .post(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_uid}`,
      {
        profile: {
          Oauth_token: parsed.oauth_token,
          Oauth_secret: parsed.oauth_token_secret,
          twitter_userId: parsed.user_id,
          twitter_handle: parsed.screen_name,
        },
      },
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    )
    .then(({ data }) => {
      res.json({
        message: `Twitter account @${parsed.screen_name} connected!`,
      });
    })
    .catch((err) => {
      console.error(err);
      next({ code: 500, message: "There was a problem saving your data" });
    });
});

router.get("/twitter/disconnect", async (req, res, next) => {
  const okta_uid = req.jwt.claims.uid;

  // Removes Oauth information from Okta user profile
  await axios
    .post(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_uid}`,
      {
        profile: {
          Oauth_token: null,
          Oauth_secret: null,
          twitter_userId: null,
          twitter_handle: null,
        },
      },
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    )
    .then(({ data }) => {
      res.json({
        message: `Twitter account disconnected!`,
      });
    })
    .catch((err) => {
      console.error(err);
      next({
        code: 500,
        message: "There was a problem disconnecting your account",
      });
    });
});

module.exports = router;
