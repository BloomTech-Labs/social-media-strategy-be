const express = require("express");
const router = express.Router();
const User = require("../users/user-model");
const axios = require("axios");
require("dotenv").config();

router.get("/", (req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err.message));
});
router.get("/user", (req, res) => {
  res.status(200).json(req.decodedToken);
});

router.delete("/:id", checkRole("admin"), async (req, res) => {
  const { okta_userid } = req.decodedToken;
  const { id } = req.params;
  console.log(okta_userid);
  console.log(process.env.OKTA_DOMAIN, "ENV");

  try {
    let deact = await axios.post(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_userid}/lifecycle/deactivate`,
      {},
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );
    console.log(deact);
    await axios.delete(
      `https://${process.env.OKTA_DOMAIN}/users/${okta_userid}`,
      {
        headers: {
          Authorization: process.env.OKTA_AUTH,
        },
      }
    );
    let userResponse = await User.remove(id);
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

router.delete("/:id/local", async (req, res) => {
  const { id } = req.params;

  try {
    let userResponse = await User.remove(id);
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

function checkRole(...roles) {
  return (req, res, next) => {
    console.log(req.decodedToken);
    if (
      req.decodedToken &&
      req.decodedToken.role &&
      roles.includes(req.decodedToken.role.toLowerCase())
    ) {
      next();
    } else {
      res.status(401).json({
        message: `Don't have Authorization for this command, contact an Admin`,
      });
    }
  };
}

module.exports = router;
