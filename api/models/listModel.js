const db = require("../../data/dbConfig");
var knex = require("knex");

module.exports = { get, add, findBy, remove, update };

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

function remove(id) {
  return db("lists").where({ id }).del();
}

function update(update, id) {
  return db("lists").where("id", id).update(update, "*");
}
