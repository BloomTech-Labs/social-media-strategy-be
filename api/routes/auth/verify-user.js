// Find user in Postgres, if user is not in Postgres, then add them to Postgres
const { findByOktaUID } = require("../mod");

async function verifyUser(req, res, next) {
  // const user = await findByOktaUID
  // req.user = user;
}

module.exports = verifyUser;
