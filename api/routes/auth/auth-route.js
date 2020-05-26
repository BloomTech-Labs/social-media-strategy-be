require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Twitter = require("twitter-lite");
const { twitterInfo } = require("../auth/middleware");
const restricted = require("../auth/restricted-middleware");
const verifyJWT = require("./okta-jwt-verifier");
const queryString = require("query-string");
var Twit = require("twit");

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
});

router.get("/twitter/authorize", verifyJWT, async (req, res, next) => {
  const callbackURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/connect/twitter/callback"
      : "https://www.so-me.net/connect/twitter/callback";
  try {
    const oauthResponse = await client.getRequestToken(callbackURL);
    console.log("callbackURL", callbackURL);
    console.log(oauthResponse);
    const redirecturl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauthResponse.oauth_token}`;

    res.status(200).json(redirecturl);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/twitter/callback", verifyJWT, async (req, res, next) => {
  const okta_uid = req.jwt.claims.uid;
  const { oauth_token, oauth_verifier } = req.body;
  console.log(req.body);

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
  console.log("parsed", parsed);

  // Sends Okta user profile Oauth information
  await axios
    .post(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_uid}`,
      {
        profile: {
          Oauth_token: parsed.oauth_token,
          Oauth_secret: parsed.oauth_token_secret,
          twitter_userId: parsed.user_id,
          twitter_screenName: parsed.screen_name,
        },
      },
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    )
    .then(({ data }) => {
      console.log(data);
      res.json({
        message: `Twitter account @${parsed.screen_name} connected!`,
      });
    })
    .catch((err) => {
      console.error(err);
      next({ code: 500, message: "There was a problem saving your data" });
    });

  //   var T = new Twit({
  //     consumer_key: process.env.CONSUMER_KEY,
  //     consumer_secret: process.env.CONSUMER_SECRET,
  //     access_token: parsed_data.oauth_token,
  //     access_token_secret: parsed_data.oauth_token_secret,
  //   });
  //   let a = await T.get("followers/ids", {
  //     screen_name: `${parsed_data.screen_name}`,
  //   });
  //   let totalfollowers = await a.data.ids.length;

  //   res.status(200).json({
  //     twitter_screenName: parsed_data.screen_name,
  //     total_followers: totalfollowers,
  //   });
  // } catch (error) {
  //   res.status(500).json({
  //     message: error.message,
  //     error: error.stack,
  //     name: error.name,
  //     code: error.code,
  //   });
  // }
});

router.get("/userInfo", restricted, twitterInfo, async (req, res) => {
  try {
    let twitInfo = await req.twit.get("users/show", {
      screen_name: `${req.okta.data.profile.twitter_screenName}`,
    });

    res.status(200).json({
      screen_name: req.okta.data.profile.twitter_screenName,
      total_followers: twitInfo.data.followers_count,
      total_following: twitInfo.data.friends_count,
      total_post: twitInfo.data.statuses_count,
      profile_img: twitInfo.data.profile_image_url_https,
      location: twitInfo.data.location,
      name: twitInfo.data.name,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/userStream", restricted, twitterInfo, async (req, res) => {
  console.log("SCREENY", req.okta.data.profile.twitter_screenName);
  try {
    let twitInfo = await req.twit.get("statuses/home_timeline/:count", {
      screen_name: `${req.okta.data.profile.twitter_screenName}`,
      count: 1,
    });

    res.status(200).json({ stream_data: twitInfo.data });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
