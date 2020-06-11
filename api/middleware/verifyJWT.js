const OktaJwtVerifier = require("@okta/jwt-verifier");

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `https://${process.env.OKTA_SUBDOMAIN}.okta.com/oauth2/default`, // required
});

const testJWT = {
  claims: {
    uid: "00ucj17sgcvh8Axqr4x6",
    twitter_handle: "SoMe_Strategy",
    sub: "alice@gmail.com",
    email: "alice@gmail.com",
  },
};

function verifyJWT(req, res, next) {
  if (process.env.NODE_ENV === "testing") {
    req.jwt = testJWT;
    return next();
  }
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next("Unauthorized");
  }

  const accessToken = match[1];
  const audience = "api://default";
  return oktaJwtVerifier
    .verifyAccessToken(accessToken, audience)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}

module.exports = verifyJWT;
