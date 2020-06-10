const request = require("supertest");
const server = require("../server.js");

describe("GET /api/lists", () => {
  it("returns 200", () => {
    return request(server)
      .get("/api/lists/")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });
});
