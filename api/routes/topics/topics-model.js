const db = require("../../../data/db.config");
var knex = require("knex");

module.exports = { find, add, remove, update, getTopicCards };

function find(filter) {
  let topics = db("topics");
  if (filter) {
    return topics.where(filter);
  } else {
    return topics;
  }
}

async function add(topics) {
  await db("topics").insert(topics);

  return find(topics).first();
}

function remove(id) {
  return db("topics")
    .where({ id })
    .del()
    .then((res) => find());
}

function update(topic, id) {
  return db("topics")
    .where("id", id)
    .update(topic)
    .then((updated) =>
      updated > 0
        ? find({ id })
            .first()
            .then((check) => getTopicCards(check.user_id))
        : null
    );
}

function getTopicCards(userId) {
  return db("topics")
    .where("user_id", userId)
    .then((topic) =>
      topic.map((e) => {
        return {
          ...e,
          cards: !e.cards.length ? e.cards : e.cards.map((c) => JSON.parse(c)),
        };
      })
    );
}
