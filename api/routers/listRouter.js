const express = require("express");
const Lists = require("../models/listModel.js");
const Posts = require("../models/postsModel.js");
const router = express.Router();

// TODO: Add updated authorization middleware

//get lists
router.get("/", async (req, res) => {
  await Lists.get()
    .then((lists) => {
      res.status(200).json(lists);
    })
    .catch((err) => {
      next({ message: err });
    });
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const list = await Lists.findBy(id);
    if (!list) {
      next({
        code: 404,
        message: "List not found",
      });
    } else {
      res.status(200).json(list);
    }
  } catch (err) {
    next();
  }
});

//get posts by list id
router.get("/:id/posts", (req, res) => {
  Posts.findBy({ list_id: req.params.id })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// POST START HERE ----------------
router.post("/", async (req, res) => {
  const okta_uid = req.jwt.claims.uid;
  const lists = await Lists.get();

  let newList = {
    ...req.body,
    okta_uid,
    index: lists.length,
  };

  Lists.add(newList);
});

// PUT START HERE --------------
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Lists.update(changes, id)
    .then((updated) => {
      res.status(200).json(updated);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// PATCH START HERE --------------
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const list = await Lists.update(update, id);
    if (!list) {
      next({
        code: 404,
        message: "Error while updating",
      });
    } else {
      res.status(200).json(list);
    }
  } catch (err) {
    next({ message: err });
  }
});

// DELETE START HERE ------------
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  Lists.remove(id)
    .then((deleted) => {
      res.status(200).json({ message: "list deleted", deleted });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
