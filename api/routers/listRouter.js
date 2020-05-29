const express = require("express");
const lists = require("../models/listModel.js");
const router = express.Router();
const { lengthcheck, routerModels, find } = require("../models/helpers");

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

// not sure if this is the right logic
router.get("/:id/posts", async (req, res) => {
  const { id } = req.params;

  if ((await lengthcheck(find("posts"), { id: id })) === 0) {
    return res.status(404).json("no posts were found in this list");
  } else {
    routerModels(find("posts", id), req, res);
  }
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
