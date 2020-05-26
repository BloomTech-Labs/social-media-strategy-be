const express = require("express");
const Topics = require("./topics-model.js");
const Joi = require("@hapi/joi");
const router = express.Router();
const Query = require("../../query");
const { oktaInfo, twitterInfo, validateuserid } = require("../auth/middleware");
const {
  lengthcheck,
  routerModels,
} = require("../../helper");

router.get("/", (req, res) => {
  routerModels(Topics.find(), req, res);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(Topics.find({ id }))) === 0) {
    return res.status(404).json("not found");
  } else {
    routerModels(Topics.find({ id: req.params.id }), req, res);
  }
});

router.get("/:id/user", async (req, res) => {
  const { id } = req.params;
  const { sortby } = req.query;
  console.log(req.query);
  if ((await lengthcheck(Topics.find({ user_id: id }))) === 0) {
    return res.status(404).json("no Topics found");
  } else {
    routerModels(Query.getTopics({ sortby }, id), req, res);
  }
});

// POST START HERE ----------------

router.post("/:id/user", (req, res) => {
  const id = req.decodedToken.okta_userid;
  const topicbody = { ...req.body, user_id: id };

  routerModels(Topics.add(topicbody), req, res);
});

// PUT START HERE --------------
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  if ((await lengthcheck(Topics.find({ id: id }))) === 0) {
    return res.status(404).json("no Topics found");
  } else {
    routerModels(Topics.update(update, id), req, res);
  }
});

// DELETE START HERE ------------
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(Topics.find({ id: id }))) === 0) {
    return res.status(404).json("no Topics found");
  } else {
    routerModels(Topics.remove(id), req, res);
  }
});

module.exports = router;
