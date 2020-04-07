const db = require('../../../data/db.config');

module.exports = { find, add, remove, update, getCards }

function find(filter) {

    let topics = db('topics');
    if (filter) {
        return topics.where(filter)
    } else {
        return topics
    }
}


async function getCards(filter) {

    let topics = db('topics');
    if (filter) {
        let tx = await topics.where(filter)
       
        return tx

    } else {
        return topics
    }
}



async function add(topics) {
    await db('topics').insert(topics);

    return find(topics).first();
}

function remove(id) {
    return db('topics').where({ id }).del().then(res => find())
}


function update(topic, id) {
    return db('topics')
        .where('id', id)
        .update(topic)
        .then(updated => (updated > 0 ? find({ id }) : null));
}