const request = require("supertest");
const server = require("../server.js");
const db = require("../../data/dbConfig");

beforeAll(() => db.seed.run());

describe("GET /api/lists", () => {
  it("returns 200", () => {
    return request(server)
      .get("/api/lists/")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the correct number of lists", () => {
    return request(server)
      .get("/api/lists/")
      .then((res) => {
        expect(res.body.length).toBe(3);
      });
  });

  it("only returns lists with the user's okta_uid", () => {
    return request(server)
      .get("/api/lists/")
      .then((res) => {
        expect(
          res.body.filter((list) => list.okta_uid === "00ucj17sgcvh8Axqr4x6")
            .length
        ).toBe(3);
      });
  });
});
