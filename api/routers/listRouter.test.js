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

describe("GET /api/lists/:id/posts", () => {
  it("returns 200 for a list that exists belonging to the logged in user", () => {
    return request(server)
      .get("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321/posts")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns an array", () => {
    return request(server)
      .get("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321/posts")
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it("returns the correct number of posts", () => {
    return request(server)
      .get("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321/posts")
      .then((res) => {
        expect(res.body.length).toBe(3);
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

describe("POST /api/lists", () => {
  it("returns 201 on success", () => {
    return request(server)
      .post("/api/lists/")
      .send({ title: "hello" })
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });

  it("returns the list with the correct index and title", () => {
    return request(server)
      .post("/api/lists/")
      .send({ title: "hello again" })
      .then((res) => {
        expect(res.body.title).toBe("hello again");
        expect(res.body.index).toBe(4);
      });
  });

  it("returns 400 when no title is provided", () => {
    return request(server)
      .post("/api/lists/")
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
});
