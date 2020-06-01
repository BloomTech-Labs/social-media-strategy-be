const express = require("express");
const router = express.Router();
const Posts = require("../models/postsModel.js");

//get posts
router.get("/", async (req, res) => {
  await Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//get posts by id
router.get("/:id", (req, res) => {
  Posts.findBy(req.params.id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

//get posts by list id
router.get("/:id/posts", (req, res) => {
  Posts.findBy({list_id: req.params.id})
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

// PUT START HERE --------------
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Posts.update(id, changes)
    .then(updated => {
      res.status(200).json(updated)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// DELETE START HERE ------------
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Posts.remove(id)
    .then(deleted => {
      res.status(200).json({message: "post deleted", deleted})
    })
    .catch(err => {
      res.status(500).json(err)
    })
});


module.exports = router;
