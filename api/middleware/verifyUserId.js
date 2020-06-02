module.exports = (req, res, next) => {
    const okta_uid = req.jwt.claims.uid;
    const param_uid = req.params.id;

    if (okta_uid !== param_uid) {
        return next({
            code: 401,
            message: "User id does not match with id passed in URL",
          });
    }
    
    next();
}