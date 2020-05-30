const db = require("../../data/dbConfig.js");

module.exports = {
    find,
    remove,
    update,
};

function find(filter) {
    let posts = db("posts");
    if (filter) {
        return posts.where(filter);
    } else {
        return posts;
    }
}

function remove(id) {
    return db("posts") 
        .where({ id })
        .del()
        .then((res) => find());
}

function update(id, changes) {
    return db('posts')
    .where({id})
    .update(changes);
}