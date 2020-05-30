const express = require("express");
const Lists = require("../models/listModel.js");
const Posts = require("../models/postsModel.js");
const router = express.Router();

// TODO: Add updated authorization middleware

//get lists
router.get("/", async (req, res) => {
  await Lists.find()
    .then(lists => {
      res.status(200).json(lists);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//get lists by id
router.get("/:id", (req, res) => {
  Lists.find(req.params.id)
    .then(list => {
      res.status(200).json(list)
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

//get posts by list id
router.get("/:id/posts", (req, res) => {
  const { id } = req.params;
  Posts.find("posts").where({list_id: id})
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

  Lists.update(id, changes)
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

  Lists.remove(id)
    .then(deleted => {
      res.status(200).json({message: "list deleted", deleted})
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

module.exports = router;
