const seedPosts = [
  {
    id: "634b0e5c-af78-425b-8ad6-4622986e2e0f",
    okta_uid: "00ucj17sgcvh8Axqr4x6",
    list_id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
    created_at: "2020-06-10 13:39:52.872039-07",
    index: 0,
    post_text: "foo",
    posted: false,
  },
  {
    id: "b46052ea-ba9b-48c7-8f31-3c4d9930b596",
    okta_uid: "00ucj17sgcvh8Axqr4x6",
    list_id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
    created_at: "2020-06-10 13:39:58.525309-07",
    index: 1,
    post_text: "bar",
    posted: false,
  },
  {
    id: "a7112c6c-75e9-4a84-aa44-357d0d90ff32",
    okta_uid: "00ucj17sgcvh8Axqr4x6",
    list_id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
    created_at: "2020-06-10 13:40:02.380562-07",
    index: 2,
    post_text: "baz",
    posted: false,
  },
  {
    id: "a2399166-caa5-497f-934d-2cad58c4e639",
    okta_uid: "00ucj17sgcvh8Axqr4x6",
    list_id: "d2b3833d-08b3-4dd8-96fe-822e3a608d82",
    created_at: "2020-06-10 13:40:31.648547-07",
    index: 0,
    post_text: "hello",
    posted: false,
  },
  {
    id: "c6bed674-29e9-4302-800d-7c371fcee539",
    okta_uid: "00ucj17sgcvh8Axqr4x6",
    list_id: "d2b3833d-08b3-4dd8-96fe-822e3a608d82",
    created_at: "2020-06-10 13:40:36.284236-07",
    index: 1,
    post_text: "world",
    posted: false,
  },
  {
    id: "0e778a73-842b-48ad-98b4-6f82ab15e853",
    okta_uid: "00ucj17sgcvh8Axqr4x6",
    list_id: "d376de05-5f1b-4086-93b1-77681ca93614",
    created_at: "2020-06-10 13:40:59.13414-07",
    index: 0,
    post_text: "here's a test tweet",
    posted: false,
  },
  {
    id: "7bee7742-b8bc-4a0c-986e-b697aba66da7",
    okta_uid: "00ucj17sgcvh8Axqr4x6",
    list_id: "d376de05-5f1b-4086-93b1-77681ca93614",
    created_at: "2020-06-10 13:41:05.369523-07",
    index: 1,
    post_text: "and another one",
    posted: false,
  },
  {
    id: "41670103-3eba-4cb3-8d17-8fd79d9d3dfa",
    okta_uid: "FAKE_ID",
    list_id: "013e4ab9-77e0-48de-9efe-4d96542e791f",
    created_at: "2020-06-10 14:02:45.597599-07",
    index: 0,
    post_text: "another user's post",
    posted: false,
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("posts")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("posts").insert(seedPosts);
    });
};
