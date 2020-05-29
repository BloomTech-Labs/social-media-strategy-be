const express = require("express");
const verifyTwitter = require("../middleware/verifyTwitter");
const axios = require("axios");
const {
  lengthcheck,
  routerModels,
  find,
  remove,
  update,
} = require("../models/helpers");

require("dotenv").config();
var moment = require("moment-timezone");
var schedule = require("node-schedule");

const router = express.Router();

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

module.exports = router;
