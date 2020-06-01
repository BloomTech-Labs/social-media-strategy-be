const db = require("../../data/dbConfig.js");

module.exports = {
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

function remove(id) {
    return db("posts") 
        .where({ id })
        .del()
}

function update(id, changes) {
    return db('posts')
    .where({id})
    .update(changes);
}