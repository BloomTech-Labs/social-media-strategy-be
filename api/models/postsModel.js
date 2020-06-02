const db = require("../../data/dbConfig");
var knex = require("knex");
//
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

function findBy(filter) {
  let posts = db("posts");
  return posts.where(filter);
}

async function add(newPost) {
  const [post] = await db("posts").insert(newPost, "*");
  return post;
}

function remove(id) {
  return db("posts").where({ id }).del();
}

function update(id, changes) {
  return db("posts").where({ id }).update(changes);
}
