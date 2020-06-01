const db = require("../../data/dbConfig");
const Lists = require("../models/listModel");
const Posts = require("../models/postsModel");

module.exports = { matchUser };

function matchUser(db_table) {
  return async (req, res, next) => {
    const [thisItem] = await db(db_table).where({ id: req.params.id });
    if (thisItem.okta_uid === req.jwt.claims.uid) {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Logged in user does not match resource owner." });
    }
  };
}
