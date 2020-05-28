// Find user in Postgres, if user is not in Postgres, then add them to Postgres
const { add, findByOktaUID, updateByOktaUID } = require("../models/usersModel");

async function verifyUser(req, res, next) {
  const { uid, sub, twitter_screenName } = req.jwt.claims;
  const user = await findByOktaUID(uid);
  if (!user) {
    add({
      okta_uid: uid,
      email: sub,
      twitter_handle: twitter_screenName,
    });
  } else {
    updateByOktaUID(uid, {
      okta_uid: uid,
      email: sub,
      twitter_handle: twitter_screenName,
    });
  }
  next();
}

module.exports = verifyUser;
