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

describe("GET /api/lists/:id", () => {
  it("returns 200 for a list that exists belonging to the logged in user", () => {
    return request(server)
      .get("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns a list that actually belongs to the logged in user", () => {
    return request(server)
      .get("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321")
      .then((res) => {
        expect(res.body.okta_uid).toBe("00ucj17sgcvh8Axqr4x6");
      });
  });

  it("returns 404 when trying to access another user's list", () => {
    return request(server)
      .get("/api/lists/013e4ab9-77e0-48de-9efe-4d96542e791f")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("returns 500 for an invalid id", () => {
    return request(server)
      .get("/api/lists/foo")
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });
});
