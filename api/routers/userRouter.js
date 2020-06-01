const express = require("express");
const router = express.Router();
const axios = require("axios");
const Users = require("../models/usersModel");
const Lists = require("../models/listModel");
const Posts = require("../models/postsModel");

router.get("/", (req, res) => {
  Users.find("users")
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err.message));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Users.findBy({ okta_uid: id })
    .then((users) => res.status(200).json(users[0]))
    .catch((err) => res.status(500).json(err.message));
});

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

router.put("/", async (req, res) => {
  const { uid, email, twitter_handle } = req.jwt.claims;
  const currentUser = {
    okta_uid: uid,
    email,
    twitter_handle,
  };

  const user = await Users.findByOktaUID(uid);
  if (!user) {
    const newUser = await Users.add(currentUser);
    res.status(201).json(newUser);
  } else {
    const updatedUser = await Users.updateByOktaUID(uid, currentUser);
    res.status(200).json(updatedUser);
  }
});

router.get("/lists", async (req, res) => {
  await Lists.find({ okta_uid: req.jwt.claims.uid })
    .then(lists => {
      res.status(200).json(lists);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

router.post("/lists", async (req, res) => {
  const { uid } = req.jwt.claims;
  const newList = {
    okta_uid: uid,
    index: req.body.index,
    title: req.body.title
  };
  await Lists.add(newList)
  .then(list => {
    res.status(200).json(list);
  })
  .catch(err => {
    res.status(500).json(err);
  })
})

router.get("/posts", async (req, res) => {
  await Posts.find({ okta_uid: req.jwt.claims.uid })
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

router.post("/posts", async (req, res) => {
  const { uid } = req.jwt.claims;
  const newPost = {
    okta_uid: uid,
    list_id: req.body.list_id,
    date: req.body.date,
    index: req.body.index,
    post_score: req.body.post_score,
    post_text: req.body.post_text,
    posted: req.body.posted || false,
    optimal_time: req.body.opimal_time
  };
  await Posts.add(newPost)
  .then(post => {
    res.status(200).json(post);
  })
  .catch(err => {
    res.status(500).json(err);
  })
})

// router.delete("/:id/local", async (req, res) => {
//   const { id } = req.params;
//   try {
//     let userResponse = await remove("users", id);
//     res.status(200).json({ message: "User deleted", userResponse });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//       error: error.stack,
//       name: error.name,
//       code: error.code,
//     });
//   }
// });

// function checkRole(...roles) {
//   return (req, res, next) => {
//     console.log(req.decodedToken);
//     if (
//       req.decodedToken &&
//       req.decodedToken.role &&
//       roles.includes(req.decodedToken.role.toLowerCase())
//     ) {
//       next();
//     } else {
//       res.status(401).json({
//         message: `Don't have Authorization for this command, contact an Admin`,
//       });
//     }
//   };
// }

module.exports = router;
