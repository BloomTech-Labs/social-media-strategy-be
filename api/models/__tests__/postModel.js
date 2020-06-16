const server = require("../../server");
const request = require("supertest");
const db = require("../../../data/dbConfig");
const Posts = require("../postsModel");

describe("GET /", () => {
  it('has process.env.NODE_ENV as "testing"', () => {
    expect(process.env.NODE_ENV).toBe("testing");
  });

  it("returns 200 OK", () => {
    return request(server).get("/").expect(200);
  });
});

describe("GET available posts", () => {
  beforeAll(async () => {
    await db("lists").del();
    await db("lists").insert({
      id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      created_at: "2020-06-08 12:51:13.821025-07",
      index: 1,
      title: "Mrs. Robinson",
    });
  });

  beforeEach(async () => {
    await db("posts").del();
  });

  afterAll(async () => {
    await db("lists").del();
  });

  test("returns 0 posts", async () => {
    let postTotal;
    postTotal = await Posts.get();
    expect(postTotal).toHaveLength(0);
  });

  test("returns 1 post", async () => {
    postTotal = await Posts.get();
    expect(postTotal).toHaveLength(0);
    await Posts.add({
      id: "634b0e5c-af78-425b-8ad6-4622986e2e0f",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      list_id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      created_at: "2020-06-10 13:39:52.872039-07",
      index: 0,
      post_text: "foo",
      posted: false,
    });
    postTotal = await Posts.get();
    expect(postTotal).toHaveLength(1);
  });

  test("removes post", async () => {
    postTotal = await Posts.get();
    expect(postTotal).toHaveLength(0);
    await Posts.add({
      id: "634b0e5c-af78-425b-8ad6-4622986e2e0f",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      list_id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      created_at: "2020-06-10 13:39:52.872039-07",
      index: 0,
      post_text: "foo",
      posted: false,
    });

    await Posts.add({
      id: "b46052ea-ba9b-48c7-8f31-3c4d9930b596",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      list_id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      created_at: "2020-06-10 13:39:58.525309-07",
      index: 1,
      post_text: "bar",
      posted: false,
    });
    await Posts.add({
      id: "a7112c6c-75e9-4a84-aa44-357d0d90ff32",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      list_id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      created_at: "2020-06-10 13:40:02.380562-07",
      index: 2,
      post_text: "baz",
      posted: false,
    });
    postTotal = await Posts.get();
    expect(postTotal).toHaveLength(3);
    await Posts.remove(
      "634b0e5c-af78-425b-8ad6-4622986e2e0f",
      "00ucj17sgcvh8Axqr4x6"
    );
    postTotal = await Posts.get();
    expect(postTotal).toHaveLength(2);
  });

  test("updates post", async () => {
    postTotal = await Posts.get();
    expect(postTotal).toHaveLength(0);
    await Posts.add({
      id: "634b0e5c-af78-425b-8ad6-4622986e2e0f",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      list_id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      created_at: "2020-06-10 13:39:52.872039-07",
      index: 0,
      post_text: "foo",
      posted: false,
    });

    await Posts.add({
      id: "b46052ea-ba9b-48c7-8f31-3c4d9930b596",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      list_id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      created_at: "2020-06-10 13:39:58.525309-07",
      index: 1,
      post_text: "bar",
      posted: false,
    });
    await Posts.add({
      id: "a7112c6c-75e9-4a84-aa44-357d0d90ff32",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      list_id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      created_at: "2020-06-10 13:40:02.380562-07",
      index: 2,
      post_text: "baz",
      posted: false,
    });

    postTotal = await Posts.get();
    expect(postTotal).toHaveLength(3);
    await Posts.update(
      "b46052ea-ba9b-48c7-8f31-3c4d9930b596",
      {
        post_text: "New post text 2",
      },
      "00ucj17sgcvh8Axqr4x6"
    );
    let postObject;
    postObject = await Posts.findBy({
      id: "b46052ea-ba9b-48c7-8f31-3c4d9930b596",
    });
    expect(postObject).toHaveLength(1);
    let updateFound;
    updateFound = await Posts.findBy({
      post_text: "New post text 2",
    });
    expect(updateFound).toHaveLength(1);
  });
});
