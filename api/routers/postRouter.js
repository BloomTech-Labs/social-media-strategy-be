const express = require("express");
const router = express.Router();
const Posts = require("../models/postsModel.js");
const verifyTwitter = require("../middleware/verifyTwitter");

// GET /api/posts
// Returns an array of all posts belonging to logged in user
router.get("/", (req, res) => {
  Posts.findBy({ okta_uid: req.jwt.claims.uid })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// GET /api/posts/:id
// Returns post with :id belonging to logged in user
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findBy({ id, okta_uid: req.jwt.claims.uid })
    .then(([post]) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// PUT /api/posts/:id/postnow
// Tweets the post with :id belonging to logged in user
router.put("/:id/postnow", verifyTwitter, async (req, res, next) => {
  const { id } = req.params;
  const okta_uid = req.jwt.claims.uid;
  try {
    const [postToTweet] = await Posts.findBy({ id, okta_uid });
    if (!postToTweet) {
      next({ code: 404, message: "Post not found!" });
    }

    if (process.env.NODE_ENV !== "testing") {
      await req.twit.post("statuses/update", {
        status: postToTweet.post_text,
      });
    }

    const postedTweet = await Posts.update(
      id,
      { ...postToTweet, posted: true },
      okta_uid
    );
    return res.status(200).json(postedTweet);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// PUT /api/posts/:id
// Updates the post with :id belonging to logged in user
router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const changes = req.body;

  Posts.update(id, changes, req.jwt.claims.uid)
    .then((updated) => {
      if (!updated) return next({ code: 404, message: "Post not found" });
      res.json(updated);
    })
    .catch((err) => {
      console.error(err);
      next({ code: 500, message: "There was a problem updating the post" });
    });
});

// PATCH /api/posts/:id
// Updates the post with :id belonging to logged in user
router.patch("/:id", (req, res, next) => {
  const { id } = req.params;
  const changes = req.body;

  Posts.update(id, changes, req.jwt.claims.uid)
    .then((updated) => {
      if (!updated) return next({ code: 404, message: "Post not found" });
      res.json(updated);
    })
    .catch((err) => {
      console.error(err);
      next({ code: 500, message: "There was a problem updating the post" });
    });
});

// DELETE /api/posts/:id
// Deletes the post with :id belonging to logged in user
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Posts.remove(id, req.jwt.claims.uid)
    .then((deleted) => {
      if (!deleted) return next({ code: 404, message: "Post not found" });
      res.status(200).json({ message: "post deleted", deleted });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
