const express = require("express");
const router = express.Router();
const axios = require("axios");
const Users = require("../models/usersModel");

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
