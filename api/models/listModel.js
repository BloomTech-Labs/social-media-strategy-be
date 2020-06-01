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

async function add(list) {
  let [addlist] = await db("lists").insert(list, '*');
  return addlist;
}

function remove(id) {
  return db("lists")
    .where({ id })
    .del()
    .then((res) => find());
}

function update(update, id) {
  return db("lists")
    .where("id", id)
    .update(update, '*');
}

function getlistCards(userId) {
  return db("lists")
    .where("okta_uid", userId)
    .then((list) =>
      list.map((e) => {
        return {
          ...e,
          cards: !e.cards.length ? e.cards : e.cards.map((c) => JSON.parse(c)),
        };
      })
    );
}

function getLists(query, id) {
  const data = db("lists").where("lists.okta_uid", id);

  if (query.sortby) {
    return data.orderBy(query.sortby, query.sortdir).then((list) =>
      list.map((e) => {
        return {
          ...e,
          cards: !e.cards.length ? e.cards : e.cards.map((c) => JSON.parse(c)),
        };
      })
    );
  } else {
    return data.then((list) =>
      list.map((e) => {
        return {
          ...e,
          cards: !e.cards.length ? e.cards : e.cards.map((c) => JSON.parse(c)),
        };
      })
    );
  }
}
