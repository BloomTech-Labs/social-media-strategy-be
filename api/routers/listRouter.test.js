const request = require("supertest");
const server = require("../server.js");
const db = require("../../data/dbConfig");

beforeAll(() => db.seed.run());

describe("GET /api/lists", () => {
  it("returns 200", () => {
    return request(server)
      .get("/api/lists/")
      .then((res) => {
        console.log(res.body);
        expect(res.status).toBe(200);
      });
  });
});
