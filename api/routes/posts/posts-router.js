const express = require("express");
const Joi = require("@hapi/joi");
const router = express.Router();
const { oktaInfo, twitterInfo, validateuserid } = require("../auth/middleware");
const axios = require("axios");
const {
  lengthcheck,
  routerModels,
  find,
  add,
  remove,
  update,
} = require("../../helper");
const restricted = require("../auth/restricted-middleware");
require("dotenv").config();
var moment = require("moment-timezone");
var schedule = require("node-schedule");

// GET --------------
router.get("/", (req, res) => {
  routerModels(find("posts"), req, res);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if ((await lengthcheck(find("posts", { id: id }))) === 0) {
    return res.status(404).json("not found");
  } else {
    routerModels(find("posts", { id: req.params.id }), req, res);
  }
});
router.get("/:id/user", async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(find("posts", { user_id: id }))) === 0) {
    return res.status(404).json("no post found");
  } else {
    routerModels(find("posts", { user_id: id }), req, res);
  }
});

//  POST TO GET REC TIME FROM DS -------
router.post("/:id/user", async (req, res) => {
  const id = req.decodedToken.okta_userid;
  //  req.okta.data  === oktainfo from middleware
  const postbody = {
    ...req.body,
    user_id: id,
  };
  try {
    let addedPost = await add("posts", postbody);
    await axios.post(
      " https://production-environment-flask.herokuapp.com/recommend",
      addedPost
    );
    return res.status(201).json(addedPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
      error: error.stack,
      name: error.name,
      code: error.code,
    });
  }
});

// TWITTER POST --------

router.post("/:id/postnow", twitterInfo, async (req, res) => {
  const id = req.decodedToken.okta_userid;

  const postbody = {
    ...req.body,
    user_id: id,
  };
  try {
    await req.twit.post("statuses/update", { status: req.body.post_text });
    let post = await add("posts", postbody);
    return res.status(201).json(post);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
      error: error.stack,
      name: error.name,
      code: error.code,
    });
  }
});

router.put("/:id/twitter", twitterInfo, async (req, res) => {
  const { id } = req.params;
  try {
    if ((await lengthcheck(find("posts", { id: id }))) === 0) {
      return res.status(404).json("no post found");
    } else {
      const twUpdate = { ...req.body, completed: true };
      let date_check = await find("posts", { id: id });
      console.log(!date_check[0].date, "CHECK");
      if (req.body.date) {
        console.log(req.body.date, id);

        // Schedule post here
        // var a = moment.tz(`${req.body.date}`, `${req.body.tz}`);
        // console.log('DEFAULT', moment.tz.guess());

        schedule.scheduleJob(id, `${req.body.date}`, async function () {
          console.log("I WENT OUT AT", new Date());
          req.twit.post("statuses/update", {
            status: req.body.post_text,
          });
        });
        routerModels(update("posts", twUpdate, id), req, res);
      } else {
        await req.twit.post("statuses/update", { status: req.body.post_text });
        routerModels(update("posts", twUpdate, id), req, res);
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      title: error.title,
      code: error.code,
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const postUpdate = req.body;

  if ((await lengthcheck(find("posts", { id: id }))) === 0) {
    return res.status(404).json("no post found");
  } else {
    routerModels(update("posts", postUpdate, id), req, res);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(find("posts", { id: id }))) === 0) {
    return res.status(404).json("no post found");
  } else {
    let date_check = await find("posts", { id: id });
    console.log(
      date_check[0].date,
      new Date(date_check[0].date) < new Date(),
      "TEST"
    );

    if (!date_check[0].date) {
      routerModels(remove("posts", id), req, res);
    } else if (
      date_check[0].completed === true &&
      new Date(date_check[0].date) < new Date()
    ) {
      routerModels(remove("posts", id), req, res);
    } else {
      var cancel_job = schedule.scheduledJobs[id];
      cancel_job.cancel();

      routerModels(remove("posts", id), req, res);
    }
  }
});

router.delete("/:id/local", async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(find("posts", { id: id }))) === 0) {
    return res.status(404).json("no post found");
  } else {
    routerModels(remove("posts", id), req, res);
  }
});

module.exports = router;
