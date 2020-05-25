require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Twitterlite = require("twitter-lite");
const { twitterInfo } = require("../auth/middleware");
const restricted = require("../auth/restricted-middleware");
const queryString = require("query-string");
var Twit = require("twit");

const client = new Twitterlite({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
});

router.get("/twitter/authorize", async (req, res, next) => {
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

router.post("/:id/callback", restricted, async (req, res, next) => {
  //Remember we restricted this
  const { okta_userid } = req.decodedToken;

  try {
    let twitaccess = await axios.post(
      `https://api.twitter.com/oauth/access_token${req.body.location.search}`
    );
    // PARSE DATA OF TWITTER AXIOS CALL
    const parsed_data = queryString.parse(twitaccess.data);

    // Sends Okta user profile Oauth information
    let ax = await axios.post(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_userid}`,
      {
        profile: {
          Oauth_token: parsed_data.oauth_token,
          Oauth_secret: parsed_data.oauth_token_secret,
          twitter_userId: parsed_data.user_id,
          twitter_screenName: parsed_data.screen_name,
          oauth_verifier: req.body.parse.oauth_verifier,
        },
      },
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );

    var T = new Twit({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: parsed_data.oauth_token,
      access_token_secret: parsed_data.oauth_token_secret,
    });
    let a = await T.get("followers/ids", {
      screen_name: `${parsed_data.screen_name}`,
    });
    let totalfollowers = await a.data.ids.length;

    res.status(200).json({
      twitter_screenName: parsed_data.screen_name,
      total_followers: totalfollowers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.stack,
      name: error.name,
      code: error.code,
    });
  }
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
