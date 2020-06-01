const db = require("../../data/dbConfig");
var knex = require("knex");

module.exports = { get, findBy, remove, update};

function get() {
  return db("lists");
}

function findBy(filter) {
  let lists = db("lists");
    return lists.where(filter);
}

function remove(id) {
  return db("lists")
    .where({ id })
    .del()
}

function update(id, changes) {
  return db('lists')
  .where({id})
  .update(changes);
}