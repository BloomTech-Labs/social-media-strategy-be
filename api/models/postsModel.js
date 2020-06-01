const db = require("../../data/dbConfig");
var knex = require("knex");

module.exports = {
  add,
  get,
  findBy,
  remove,
  update,
};

function get() {
  return db("posts");
}

function add(post) {
  return db("posts").insert(post, "*");
}

function findBy(filter) {
  let posts = db("posts");
  return posts.where(filter);
}

function remove(id) {
  return db("posts").where({ id }).del();
}

function update(id, changes) {
  return db("posts").where({ id }).update(changes);
}
