const db = require("../../data/dbConfig");
var knex = require("knex");

module.exports = { find, add, remove, update };

function find(filter) {
  let lists = db("lists");
  if (filter) {
    return lists.where(filter);
  } else {
    return lists;
  }
}

async function add(newList) {
  const [list] = await db("lists").insert(newList, "*");
  return list;
}

function remove(id) {
  return db("lists")
    .where({ id })
    .del()
    .then((res) => find());
}

function update(id, changes) {
  return db("lists").where({ id }).update(changes);
}
