const express = require("express");
const router = express.Router();
const AuthRouter = require("./auth/authRouter");
const verifyJWT = require("../middleware/verifyJWT");
const verifyUser = require("../middleware/verifyUser");
const UserRouter = require("./userRouter");
const ListRouter = require("./listRouter");
const PostRouter = require("./postRouter");

router.get("/", (req, res) => {
  res.status(200).json({ welcome: "API router" });
});

router.use(verifyJWT);
router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/lists", ListRouter);
router.use("/posts", PostRouter);

module.exports = router;
