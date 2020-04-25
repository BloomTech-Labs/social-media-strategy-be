const db = require('../data/db.config.js');

module.exports = [
  joivalidation,
  joivalidationError,
  lengthcheck,
  routerModels,
  find,
  add,
  remove,
  update,
  findByID,
];

function joivalidation(reqbody, schema) {
  return Object.keys(reqbody).length === 0 || schema.validate(reqbody).error;
}
function joivalidationError(reqbody, schema) {
  return schema.validate(reqbody).error;
}
async function lengthcheck(model) {
  let lengthcheck = await model;
  return lengthcheck.length;
}

function routerModels(modal, req, res) {
  modal
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error.message, 'ERROR');
      res.status(500).json({
        message: error.message,
        error: error.stack,
        name: error.name,
        code: error.code,
      });
    });
}

function find(table, filter) {
  let posts = db(`${table}`);
  if (filter) {
    return posts.where(filter);
  } else {
    return posts;
  }
}

async function add(table, payload) {
  await db(`${table}`).insert(payload);

  return find(table, payload).first();
}

function remove(table, id) {
  return db(`${table}`)
    .where({ id })
    .del()
    .then((res) => find(table));
}

function update(table, payload, id) {
  return db(`${table}`)
    .where('id', id)
    .update(payload)
    .then((updated) => (updated > 0 ? find(table, { id }) : null));
}

function findByID(table, id) {
  let data = db(`${table}`);

  if (id) {
    return data.where({ id: id }).first();
  } else {
    return data;
  }
}
