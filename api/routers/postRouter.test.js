const request = require("supertest");
const server = require("../server.js");
const db = require("../../data/dbConfig");

beforeAll(() => db.seed.run());

describe("GET /api/posts", () => {
  it("returns 200", () => {
    return request(server)
      .get("/api/posts/")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the correct number of posts", () => {
    return request(server)
      .get("/api/posts/")
      .then((res) => {
        expect(res.body.length).toBe(7);
      });
  });

  it("only returns posts with the user's okta_uid", () => {
    return request(server)
      .get("/api/posts/")
      .then((res) => {
        expect(
          res.body.filter((post) => post.okta_uid === "00ucj17sgcvh8Axqr4x6")
            .length
        ).toBe(7);
      });
  });
});
