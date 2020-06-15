const request = require("supertest");
const server = require("../../server.js");

describe("GET /api", () => {
  it("returns 200", () => {
    return request(server)
      .get("/api")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });
});
