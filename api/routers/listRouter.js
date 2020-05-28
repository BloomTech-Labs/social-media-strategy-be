const express = require("express");
const lists = require("../models/listModel.js");
const router = express.Router();
const { lengthcheck, routerModels } = require("../models/helpers");

// TODO: Add updated authorization middleware

router.get("/", (req, res) => {
  routerModels(lists.find(), req, res);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(lists.find({ id }))) === 0) {
    return res.status(404).json("not found");
  } else {
    routerModels(lists.find({ id: req.params.id }), req, res);
  }
});

router.get("/:id/user", async (req, res) => {
  const { id } = req.params;
  const { sortby } = req.query;
  console.log(req.query);
  if ((await lengthcheck(lists.find({ user_id: id }))) === 0) {
    return res.status(404).json("no lists found");
  } else {
    routerModels(lists.getLists({ sortby }, id), req, res);
  }
});

// POST START HERE ----------------

router.post("/:id/user", (req, res) => {
  const id = req.decodedToken.okta_userid;
  const listbody = { ...req.body, user_id: id };

  routerModels(lists.add(listbody), req, res);
});

// PUT START HERE --------------
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  if ((await lengthcheck(lists.find({ id: id }))) === 0) {
    return res.status(404).json("no lists found");
  } else {
    routerModels(lists.update(update, id), req, res);
  }
});

// DELETE START HERE ------------
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(lists.find({ id: id }))) === 0) {
    return res.status(404).json("no lists found");
  } else {
    routerModels(lists.remove(id), req, res);
  }
});

module.exports = router;
