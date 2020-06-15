const db = require("../../data/dbConfig");
var knex = require("knex");

module.exports = { add, get, findBy, remove, update };

function get() {
  return db("lists");
}

async function add(list) {
  let [addlist] = await db("lists").insert(list, "*");
  return addlist;
}

function findBy(filter) {
  return db("lists").where(filter);
}

function remove(id, okta_uid) {
  return db("lists").where({ id, okta_uid }).del();
}

async function update(update, id, okta_uid) {
  const [updated] = await db("lists")
    .where({ id, okta_uid })
    .update(update, "*");
  return updated;
}
