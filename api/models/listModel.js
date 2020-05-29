const db = require("../../data/dbConfig");
var knex = require("knex");

module.exports = { find, add, remove, update, getlistCards, getLists };

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

function update(list, id) {
  return db("lists")
    .where("id", id)
    .update(list)
    .then((updated) =>
      updated > 0
        ? find({ id })
            .first()
            .then((check) => getlistCards(check.user_id)) & console.log(updated)
        : null
    );
}
