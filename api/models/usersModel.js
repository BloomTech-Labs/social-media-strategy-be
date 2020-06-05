const db = require("../../data/dbConfig");

module.exports = {
  add,
  find,
  findBy,
  findByOktaUID,
  updateByOktaUID,
  update,
  remove,
};

function find() {  // test 1
  return db("users");
}

function findBy(filter) {  // test 2
  return db("users").where(filter);
}

async function add(newUser) { // test 3
  const [user] = await db("users").insert(newUser, "*");
  return user;
}

function findByOktaUID(okta_uid) { // test 4
  return db("users").where({ okta_uid }).first();
}

async function updateByOktaUID(okta_uid, updates) {
  const [user] = await db("users").where({ okta_uid }).update(updates, '*');
  return user;
}

function update(payload, okta_uid) {
  return db("users")
    .where("okta_uid", okta_uid)
    .update(payload)
    .then((updated) => (updated > 0 ? find("users", { okta_uid }) : null));
}

function remove(okta_uid) {
  return db("users")
    .where({ okta_uid })
    .del()
    .then((res) => find("users"));
}
