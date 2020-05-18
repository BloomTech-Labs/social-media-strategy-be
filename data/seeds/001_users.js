exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          email: "some@test.com",
          password:
            "$2a$10$RLMiGvYEo8DLIOMS7CXPQ.GjJnHzO91MQFwVAndcUQZvqGwZ5HN/a",
          okta_userid: "00uc5g9hhHet4fOqH4x6",
        },
        {
          email: "jack@test.com",
          password:
            "$2a$10$KgZCZogsKpAB4sQWTtq6KOSh6bRfRAt1TsG6g.hAI0NObh4qpqKQ2",
          okta_userid: "00uc5m8mocgI0NbKG4x6",
        },
      ]);
    });
};
