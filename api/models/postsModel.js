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

function remove(id, okta_uid) {
  return db("posts").where({ id, okta_uid }).del();
}

async function update(id, changes, okta_uid) {
  const [updated] = await db("posts")
    .where({ id, okta_uid })
    .update(changes, "*");
  return updated;
}
