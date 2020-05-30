const db = require("../../data/dbConfig");
var knex = require("knex");

module.exports = { find, remove, update};

function find(filter) {
  let lists = db("lists");
  if (filter) {
    return lists.where(filter);
  } else {
    return lists;
  }
}

function remove(id) {
  return db("lists")
    .where({ id })
    .del()
    .then((res) => find());
}

function update(id, changes) {
  return db('lists')
  .where({id})
  .update(changes);
}