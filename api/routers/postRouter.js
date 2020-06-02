const express = require("express");
const router = express.Router();
const Posts = require("../models/postsModel.js");
const Twitter = require("twit");

const verifyTwitter = require("../middleware/verifyTwitter");

//get posts
router.get("/", async (req, res) => {
  await Posts.get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//get posts by id
router.get("/:id", (req, res) => {
  Posts.findBy(req.params.id)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
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
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.put("/:id/postnow", verifyTwitter, async (req, res, next) => {
  const { id } = req.params;
  try {
    const [postToTweet] = await Posts.findBy({ id });
    if (!postToTweet) {
      next({ code: 404, message: "Post not found!" });
    }

    const results = await req.twit.post("statuses/update", {
      status: postToTweet.post_text,
    });
    let postedTweet = await Posts.update(id, { ...postToTweet, posted: true });
    return res.status(200).json(postedTweet);
  } catch (err) {
    //console.error(err);
    res.status(500).json(err);
  }
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

// PATCH START HERE --------------
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  Posts.update(id, update)
    .then((post) => {
      res.json(post);
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
