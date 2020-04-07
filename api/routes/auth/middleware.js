const Users = require('../../routes/users/user-model');
module.exports = { validateuserid };

function validateuserid(req, res, next) {
  const { id } = req.params;
  Users.find(id)
    .then(user =>
      user
        ? (req.oktaid = user.okta_userid) & next()
        : res.status(400).json({ error: 'Not a Valid ID' })
    )
    .catch(err => res.status(500).json(err.message));
}
