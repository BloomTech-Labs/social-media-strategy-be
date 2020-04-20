const db = require('../data/db.config');

module.exports = { getTopics };

function getTopics(query, id) {
  const data = db('topics').where('user_id', id);

  if (query.sortby) {
    return data.orderBy(query.sortby, query.sortdir).then((topic) =>
      topic.map((e) => {
        return {
          ...e,
          cards: !e.cards.length ? e.cards : e.cards.map((c) => JSON.parse(c)),
        };
      })
    );
  } else {
    return data.then((topic) =>
      topic.map((e) => {
        return {
          ...e,
          cards: !e.cards.length ? e.cards : e.cards.map((c) => JSON.parse(c)),
        };
      })
    );
  }
}
