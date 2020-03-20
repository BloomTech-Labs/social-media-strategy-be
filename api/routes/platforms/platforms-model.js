const db = require('../../../data/db.config');

module.exports = {find, add,remove,update}

function find(filter){

    let platforms = db('platforms');
    if(filter){
        return platforms.where(filter)
    }else{
        return platforms
    }
}

async function add(platforms){
    await db('platforms').insert(platforms);

    return find(platforms).first();
}

function remove(id){
    return db('platforms').where({id}).del().then(res => find())
}


function update(platform, id) {
    return db('platforms')
      .where('id', id)
      .update(platform)
      .then(updated => (updated > 0 ? find({id}) : null));
  }