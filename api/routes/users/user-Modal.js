const db = require('../../../data/db.config');

module.exports = { find, add, findBy };

function find(id) {
  let user = db('users');

  if (id) {
    return user.where({ id: id }).first();
  } else {
    return user;
  }
}

async function add(user) {
  await db('users').insert(user);

  return find(user.id);
}

function findBy(filter) {
  return db('users').where(filter);
}
