const db = require("../../data/dbConfig.js");

module.exports = {
  lengthcheck,
  routerModels,
  find,
  remove,
  update,
};

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
      console.log(error.message, "ERROR");
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

function remove(table, id) {
  return db(`${table}`)
    .where({ id })
    .del()
    .then((res) => find(table));
}

function update(table, payload, id) {
  return db(`${table}`)
    .where("id", id)
    .update(payload)
    .then((updated) => (updated > 0 ? find(table, { id }) : null));
}
