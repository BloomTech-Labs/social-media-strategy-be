const seedLists = [
  {
    id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
    okta_uid: "00ucj17sgcvh8Axqr4x6",
    created_at: "2020-06-08 12:51:13.821025-07",
    index: 0,
    title: "list 1",
  },
  {
    id: "d2b3833d-08b3-4dd8-96fe-822e3a608d82",
    okta_uid: "00ucj17sgcvh8Axqr4x6",
    created_at: "2020-06-08 12:51:21.129036-07",
    index: 1,
    title: "list 2",
  },
  {
    id: "d376de05-5f1b-4086-93b1-77681ca93614",
    okta_uid: "00ucj17sgcvh8Axqr4x6",
    created_at: "2020-06-10 13:39:35.35354-07",
    index: 2,
    title: "list 3",
  },
  {
    id: "013e4ab9-77e0-48de-9efe-4d96542e791f",
    okta_uid: "FAKE_ID",
    created_at: "2020-06-10 14:02:36.8136-07",
    index: 0,
    title: "another user's list",
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("lists")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("lists").insert(seedLists);
    });
};
