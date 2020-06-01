require("dotenv").config();
const express = require("express");
const Posts = require("../models/postsModel.js");
const router = express.Router();

//// GET --------------
router.get("/", (req, res) => {
  Posts.get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//get posts by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findBy({ id })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// POST
router.post("/", async (req, res) => {
  const okta_uid = req.jwt.claims.uid;
  const currentPosts = await Posts.findBy({ list_id: req.body.list_id });

  let newPost = {
    ...req.body,
    okta_uid,
    date: 1, // TODO: change it to valid current date
    index: currentPosts.length,
  };

  Posts.add(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// PATCH START HERE --------------
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  Posts.update(id, update)
    .then(post => {
      res.json(post);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// PUT START HERE --------------
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Posts.update(id, changes)
    .then((updated) => {
      res.status(200).json(updated);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// DELETE START HERE ------------
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Posts.remove(id)
    .then((deleted) => {
      res.status(200).json({ message: "post deleted", deleted });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
