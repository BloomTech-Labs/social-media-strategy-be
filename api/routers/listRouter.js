const express = require("express");
const List = require("../models/listModel.js");
const Post = require("../models/postsModel.js");
const router = express.Router();
const { lengthcheck, routerModels } = require("../models/helpers");

// TODO: Add updated authorization middleware

router.get("/", (req, res) => {
  routerModels(List.find(), req, res);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(List.find({ id }))) === 0) {
    return res.status(404).json("not found");
  } else {
    routerModels(List.find({ id: req.params.id }), req, res);
  }
});

router.get("/:id/posts", async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(List.find({ id }))) === 0) {
    return res.status(404).json("not found");
  } else {
    // const posts = await Post.find({ list_id: id });
    // console.log('\n****POSTS****\n', posts);
    routerModels(Post.find({ list_id: id }), req, res);
  }
});

router.get("/:id/user", async (req, res) => {
  const { id } = req.params;
  const { sortby } = req.query;
  console.log(req.query);
  if ((await lengthcheck(List.find({ user_id: id }))) === 0) {
    return res.status(404).json("no lists found");
  } else {
    routerModels(List.getLists({ sortby }, id), req, res);
  }
});

// POST START HERE ----------------

router.post("/", async (req, res) => {
  const okta_uid = req.jwt.claims.uid;
  const lists = await List.find();
  
  let newList = { 
    ...req.body,
    okta_uid,
    index: lists.length
  };

  routerModels(List.add(newList), req, res);
});

// PUT START HERE --------------
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  if ((await lengthcheck(List.find({ id: id }))) === 0) {
    return res.status(404).json("no lists found");
  } else {
    routerModels(List.update(update, id), req, res);
  }
});

// PATCH START HERE --------------
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  
  routerModels(List.update(update, id), req, res);
});

// DELETE START HERE ------------
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if ((await lengthcheck(List.find({ id: id }))) === 0) {
    return res.status(404).json("no lists found");
  } else {
    routerModels(List.remove(id), req, res);
  }
});

module.exports = router;
