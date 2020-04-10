exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          email: 'Dev@dev.com',
          password: 'test1',
          okta_userid: '123455'
        },
        {
          id: 2,
          email: 'Dev1@dev.com',
          password: 'test1',
          okta_userid: '1234515'
        },
        {
          id: 3,
          email: 'Dev2@dev.com',
          password: 'test1',
          okta_userid: '12345512'
        }
      ]);
    });
};
