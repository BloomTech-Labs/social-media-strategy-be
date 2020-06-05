const express = require("express");
const router = express.Router();
const AuthRouter = require("./auth/authRouter");
const verifyJWT = require("../middleware/verifyJWT");
const verifyUser = require("../middleware/verifyUser");
const UserRouter = require("./userRouter");
const ListRouter = require("./listRouter");
const PostRouter = require("./postRouter");

router.get("/", (req, res) => {
  res.status(200).json({ welcome: "API router" });  /*   /api     */
});

/*          /api           */

router.use(verifyJWT);
router.use("/auth", AuthRouter);   /*   /api/auth      */
router.use("/users", UserRouter);  /*   /api/users     */
router.use("/lists", ListRouter);  /*   /api/lists     */
router.use("/posts", PostRouter);  /*   /api/posts     */

module.exports = router;
