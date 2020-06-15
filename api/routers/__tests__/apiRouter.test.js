const request = require("supertest");
const server = require("../../server.js");

describe("GET /api", () => {
  it("returns 200", async () => {
    await request(server).get("/api").expect(200);
  });
});
