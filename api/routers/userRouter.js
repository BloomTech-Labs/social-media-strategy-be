const express = require("express");
const router = express.Router();
const axios = require("axios");
const Users = require("../models/usersModel");
const Lists = require("../models/listModel");
const Posts = require("../models/postsModel");
const verifyUserId = require("../middleware/verifyUserId");

// test 1
// middleware to verify if id param matches to user id
router.use("/:id", verifyUserId);

// test 2
router.get("/", (req, res) => {
  Users.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err.message));
});

// test 3
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Users.findBy({ okta_uid: id })
    .then((users) => res.status(200).json(users[0]))
    .catch((err) => res.status(500).json(err.message));
});

// test 4
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let deact = await axios.post(
      `https://${process.env.OKTA_DOMAIN}/users/${id}/lifecycle/deactivate`,
      {},
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );
    await axios.delete(`https://${process.env.OKTA_DOMAIN}/users/${id}`, {
      headers: {
        Authorization: process.env.OKTA_AUTH,
      },
    });

    let userResponse = await Users.remove(id);

    res.status(200).json({ message: "User deleted", userResponse });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.stack,
      name: error.name,
      code: error.code,
    });
  }
});

// test 5
router.put("/:id", async (req, res) => {
  const { uid, email, twitter_handle } = req.jwt.claims;
  const currentUser = {
    okta_uid: uid,
    email,
    twitter_handle,
  };

  const [user] = await Users.findBy({ okta_uid: uid });
  console.log("user", user);
  if (!user) {
    const newUser = await Users.add(currentUser);
    res.status(201).json(newUser);
  } else {
    const updatedUser = await Users.updateByOktaUID(uid, currentUser);
    res.status(200).json(updatedUser);
  }
});

// test 6
router.get("/:id/lists", async (req, res) => {
  Lists.findBy({ okta_uid: req.jwt.claims.uid })
    .then((lists) => {
      res.status(200).json(lists);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// test 7
router.post("/:id/lists", async (req, res) => {
  const okta_uid = req.jwt.claims.uid;
  const lists = await Lists.findBy({ okta_uid });

  let newList = {
    ...req.body,
    okta_uid,
    index: lists.length,
  };

  Lists.add(newList)
    .then((list) => {
      res.status(200).json(list);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// test 8
router.get("/:id/posts", async (req, res) => {
  await Posts.findBy({ okta_uid: req.jwt.claims.uid })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// test 9
router.post("/:id/lists/:list_id/posts", async (req, res) => {
  const okta_uid = req.jwt.claims.uid;
  const { list_id } = req.params;

  // Get current posts from the same list to generate the index of the new post
  const currentPosts = await Posts.findBy({ okta_uid, list_id });

  const newPost = {
    ...req.body,
    okta_uid,
    list_id,
    index: currentPosts.length,
    date: 1, // TODO: change to real current date
  };

  Posts.add(newPost)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
