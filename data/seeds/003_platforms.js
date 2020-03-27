exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('platforms')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('platforms').insert([
        { id: 1, user_id: 1, platform: 'twitter' },
        { id: 2, user_id: 2, platform: 'twitter' },
        { id: 3, user_id: 3, platform: 'twitter' }
      ]);
    });
};
