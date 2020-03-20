const db = require('../../../data/db.config');

module.exports = { find, add, remove, update };

function find(filter) {
  let posts = db('posts');
  if (filter) {
    return posts.where(filter);
  } else {
    return posts;
  }
}

async function add(post) {
  await db('posts').insert(post);

  return find(post).first();
}

function remove(id) {
  return db('posts')
    .where({ id })
    .del()
    .then(res => find());
}

function update(post, id) {
  return db('posts')
    .where('id', id)
    .update(post)
    .then(updated => (updated > 0 ? find({ id }) : null));
}
