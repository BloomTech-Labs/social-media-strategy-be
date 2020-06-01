const express = require("express");
const Lists = require("../models/listModel.js");
const Posts = require("../models/postsModel.js");
const router = express.Router();

// TODO: Add updated authorization middleware

//get lists
router.get("/", (req, res) => {
  Lists.get()
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
  const currentLists = await Lists.findBy({ okta_uid });

  let newList = {
    ...req.body,
    okta_uid,
    index: currentLists.length,
  };

  Lists.add(newList)
    .then(list => {
      res.status(201).json(list);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// CREATE NEW POST TO THE LIST
router.post("/:id/posts", async (req, res) => {
  const okta_uid = req.jwt.claims.uid;
  const list_id = req.params.id;
  const currentPosts = await Posts.findBy({ okta_uid, list_id });

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
