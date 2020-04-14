exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('platforms')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('platforms').insert([
        { id: 1, platform: 'Twitter' }
      ]);
    });
};
