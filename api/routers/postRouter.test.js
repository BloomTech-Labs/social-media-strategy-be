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
        ).toBe(res.body.length);
      });
  });
});

describe("GET /api/posts/:id", () => {
  it("returns 200", () => {
    return request(server)
      .get("/api/posts/634b0e5c-af78-425b-8ad6-4622986e2e0f")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns a post that actually belongs to the logged in user", () => {
    return request(server)
      .get("/api/posts/634b0e5c-af78-425b-8ad6-4622986e2e0f")
      .then((res) => {
        expect(res.body.okta_uid).toBe("00ucj17sgcvh8Axqr4x6");
      });
  });

  it("returns 404 when trying to access another user's post", () => {
    return request(server)
      .get("/api/lists/41670103-3eba-4cb3-8d17-8fd79d9d3dfa")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("returns 500 for an invalid id", () => {
    return request(server)
      .get("/api/posts/foo")
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });
});

describe("PUT /api/posts/:id/postnow", () => {
  it("returns 200", () => {
    return request(server)
      .put("/api/posts/634b0e5c-af78-425b-8ad6-4622986e2e0f/postnow")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns returns the posted tweet", () => {
    return request(server)
      .put("/api/posts/b46052ea-ba9b-48c7-8f31-3c4d9930b596/postnow")
      .then((res) => {
        expect(res.body.posted).toBe(true);
      });
  });

  it("returns 404 when trying to tweet a post not belonging to logged in user", () => {
    return request(server)
      .put("/api/posts/41670103-3eba-4cb3-8d17-8fd79d9d3dfa/postnow")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("PUT /api/posts/:id", () => {
  it("returns 200", () => {
    return request(server)
      .put("/api/posts/a7112c6c-75e9-4a84-aa44-357d0d90ff32")
      .send({ post_text: "updated text" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the updated post", () => {
    return request(server)
      .put("/api/posts/a7112c6c-75e9-4a84-aa44-357d0d90ff32")
      .send({ post_text: "updated text again" })
      .then((res) => {
        expect(res.body.post_text).toBe("updated text again");
      });
  });

  it("returns 404 when trying to update a post that does not belong to logged in user", () => {
    return request(server)
      .put("/api/posts/41670103-3eba-4cb3-8d17-8fd79d9d3dfa")
      .send({ post_text: "trying to update another user's post" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("PATCH /api/posts/:id", () => {
  it("returns 200", () => {
    return request(server)
      .patch("/api/posts/a7112c6c-75e9-4a84-aa44-357d0d90ff32")
      .send({ post_text: "updated text" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the updated post", () => {
    return request(server)
      .patch("/api/posts/a7112c6c-75e9-4a84-aa44-357d0d90ff32")
      .send({ post_text: "updated text again" })
      .then((res) => {
        expect(res.body.post_text).toBe("updated text again");
      });
  });

  it("returns 404 when trying to update a post that does not belong to logged in user", () => {
    return request(server)
      .patch("/api/posts/41670103-3eba-4cb3-8d17-8fd79d9d3dfa")
      .send({ post_text: "trying to update another user's post" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("DELETE /api/posts/:id", () => {
  it("returns 200 on success", () => {
    return request(server)
      .delete("/api/posts/634b0e5c-af78-425b-8ad6-4622986e2e0f")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the number of deleted posts", () => {
    return request(server)
      .delete("/api/posts/b46052ea-ba9b-48c7-8f31-3c4d9930b596")
      .then((res) => {
        expect(res.body.deleted).toBe(1);
      });
  });

  it("returns 404 when trying to delete a list that does not belong to logged in user", () => {
    return request(server)
      .delete("/api/posts/41670103-3eba-4cb3-8d17-8fd79d9d3dfa")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});
