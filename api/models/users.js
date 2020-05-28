const db = require("../../data/db.config");

module.exports = {
  add,
  find,
  findBy,
  findByOktaUID,
  updateByOktaUID,
};

function find() {
  return db("users");
}

function findBy(filter) {
  return db("users").where(filter);
}

async function add(newUser) {
  const [user] = await db("users").insert(newUser, "*");
  return user;
}

function findByOktaUID(okta_uid) {
  return db("users").where({ okta_uid }).first();
}

function updateByOktaUID(okta_uid, updates) {
  return db("users").where({ okta_uid }).update(updates);
}
