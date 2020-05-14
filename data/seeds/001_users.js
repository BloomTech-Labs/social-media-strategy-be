exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1,
          email: "some@test.com",
          // unhashed password : some
          password:
            "$2a$10$RLMiGvYEo8DLIOMS7CXPQ.GjJnHzO91MQFwVAndcUQZvqGwZ5HN/a",
          okta_userid: "00uc5g9hhHet4fOqH4x6",
        },
      ]);
    });
};
