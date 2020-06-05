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

// test 1
function find() {  
  return db("users");
}

// test 2
function findBy(filter) {  
  return db("users").where(filter);
}

// test 3
async function add(newUser) { 
  const [user] = await db("users").insert(newUser, "*");
  console.log("add newUser", user);
  return user;
}

// test 4
function findByOktaUID(okta_uid) { 
  return db("users").where({ okta_uid }).first();
}

// test 5
async function updateByOktaUID(okta_uid, updates) { 
  const user = await db("users").where({ okta_uid }).update(updates);
  console.log("updateByOktaUID user", user);
  return user;
}

// test 6
function update(payload, okta_uid) { 
  return db("users")
    .where("okta_uid", okta_uid)
    .update(payload)
    .then((updated) => (updated > 0 ? find("users", { okta_uid }) : null));
}

// test 7
function remove(okta_uid) {  
  return db("users")
    .where({ okta_uid })
    .del()
    .then((res) => find("users"));
}
