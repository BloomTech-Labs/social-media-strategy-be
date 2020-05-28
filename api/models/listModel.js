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

async function add(lists) {
  let addlist = await db("lists").insert(lists);

  // return find(lists);
  return addlist.rowCount;
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
