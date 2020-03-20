exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        { id: 1, email: 'Dev@dev.com', password: 'test1' },
        { id: 2, email: 'Dev1@dev.com', password: 'test1' },
        { id: 3, email: 'Dev2@dev.com', password: 'test1' }
      ]);
    });
};
