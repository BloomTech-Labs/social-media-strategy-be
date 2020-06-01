const db = require("../../data/dbConfig");
var knex = require("knex");

module.exports = { find, add, update };

function find(filter) {
    let posts = db("posts");
    // console.log(posts);
    if (filter) {
        return posts.where(filter);
    } else {
        return posts;
    }
}

async function add(post) {
    let [addPost] = await db("posts").insert(post, '*');
    return addPost;
}

function update(update, id) {
    return db("posts")
        .where("id", id)
        .update(update, '*');
}
