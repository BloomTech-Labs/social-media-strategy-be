exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("topics")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("topics").insert([
        { id: 1, user_id: 1, name: "Dev group" },
        { id: 2, user_id: 1, name: "Woman in Sports" },
        { id: 3, user_id: 1, name: "Basketball" },
      ]);
    });
};
