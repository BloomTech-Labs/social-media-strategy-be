// Find user in Postgres, if user is not in Postgres, then add them to Postgres
const { add, findByOktaUID, updateByOktaUID } = require("../models/usersModel");

async function verifyUser(req, res, next) {
  const { uid, sub, twitter_handle } = req.jwt.claims;
  const user = await findByOktaUID(uid);
  if (!user) {
    add({
      okta_uid: uid,
      email: sub,
      twitter_handle,
    });
  } else {
    updateByOktaUID(uid, {
      okta_uid: uid,
      email: sub,
      twitter_handle,
    });
  }
  next();
}

module.exports = verifyUser;
