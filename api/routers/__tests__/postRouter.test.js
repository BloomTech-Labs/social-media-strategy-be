const request = require("supertest");
const server = require("../../server.js");
const db = require("../../../data/dbConfig");

beforeAll(async () => {
  await db("posts").del();
  await db("lists").del();
  await db.seed.run();
});

afterAll(async () => {
  await db("posts").del();
  await db("lists").del();
});

describe("GET /api/posts", () => {
  it("returns 200", async () => {
    await request(server)
      .get("/api/posts/")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the correct number of posts", async () => {
    await request(server)
      .get("/api/posts/")
      .then((res) => {
        expect(res.body.length).toBe(7);
      });
  });

  it("only s posts with the user's okta_uid", async () => {
    await request(server)
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
  it("returns 200", async () => {
    await request(server)
      .get("/api/posts/634b0e5c-af78-425b-8ad6-4622986e2e0f")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns a post that actually belongs to the logged in user", async () => {
    await request(server)
      .get("/api/posts/634b0e5c-af78-425b-8ad6-4622986e2e0f")
      .then((res) => {
        expect(res.body.okta_uid).toBe("00ucj17sgcvh8Axqr4x6");
      });
  });

  it("returns 404 when trying to access another user's post", async () => {
    await request(server)
      .get("/api/lists/41670103-3eba-4cb3-8d17-8fd79d9d3dfa")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("returns 500 for an invalid id", async () => {
    await request(server)
      .get("/api/posts/foo")
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });
});

describe("PUT /api/posts/:id/postnow", () => {
  it("returns 200", async () => {
    await request(server)
      .put("/api/posts/634b0e5c-af78-425b-8ad6-4622986e2e0f/postnow")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the posted tweet", async () => {
    await request(server)
      .put("/api/posts/b46052ea-ba9b-48c7-8f31-3c4d9930b596/postnow")
      .then((res) => {
        expect(res.body.posted).toBe(true);
      });
  });

  it("returns 404 when trying to tweet a post not belonging to logged in user", async () => {
    await request(server)
      .put("/api/posts/41670103-3eba-4cb3-8d17-8fd79d9d3dfa/postnow")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("PUT /api/posts/:id", () => {
  it("returns 200", async () => {
    await request(server)
      .put("/api/posts/a7112c6c-75e9-4a84-aa44-357d0d90ff32")
      .send({ post_text: "updated text" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the updated post", async () => {
    await request(server)
      .put("/api/posts/a7112c6c-75e9-4a84-aa44-357d0d90ff32")
      .send({ post_text: "updated text again" })
      .then((res) => {
        expect(res.body.post_text).toBe("updated text again");
      });
  });

  it("returns 404 when trying to update a post that does not belong to logged in user", async () => {
    await request(server)
      .put("/api/posts/41670103-3eba-4cb3-8d17-8fd79d9d3dfa")
      .send({ post_text: "trying to update another user's post" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("PATCH /api/posts/:id", () => {
  it("returns 200", async () => {
    await request(server)
      .patch("/api/posts/a7112c6c-75e9-4a84-aa44-357d0d90ff32")
      .send({ post_text: "updated text" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the updated post", async () => {
    await request(server)
      .patch("/api/posts/a7112c6c-75e9-4a84-aa44-357d0d90ff32")
      .send({ post_text: "updated text again" })
      .then((res) => {
        expect(res.body.post_text).toBe("updated text again");
      });
  });

  it("returns 404 when trying to update a post that does not belong to logged in user", async () => {
    await request(server)
      .patch("/api/posts/41670103-3eba-4cb3-8d17-8fd79d9d3dfa")
      .send({ post_text: "trying to update another user's post" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("DELETE /api/posts/:id", () => {
  it("returns 200 on success", async () => {
    await request(server)
      .delete("/api/posts/634b0e5c-af78-425b-8ad6-4622986e2e0f")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the number of deleted posts", async () => {
    await request(server)
      .delete("/api/posts/b46052ea-ba9b-48c7-8f31-3c4d9930b596")
      .then((res) => {
        expect(res.body.deleted).toBe(1);
      });
  });

  it("returns 404 when trying to delete a list that does not belong to logged in user", async () => {
    await request(server)
      .delete("/api/posts/41670103-3eba-4cb3-8d17-8fd79d9d3dfa")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("PUT /api/posts/:id/schedule", () => {
  it("returns status 400 for an invalid date", async () => {
    await request(server)
      .put("/api/posts/a7112c6c-75e9-4a84-aa44-357d0d90ff32/schedule")
      .send({ date: new Date() })
      .then((res) => expect(res.status).toBe(400));
  });

  it("returns status 404 when trying to schedule another user's post", async () => {
    await request(server)
      .put("/api/posts/41670103-3eba-4cb3-8d17-8fd79d9d3dfa/schedule")
      .send({ date: new Date(Date.now() + 10000) })
      .then((res) => expect(res.status).toBe(404));
  });

  it("returns status 200 on success", async () => {
    await request(server)
      .put("/api/posts/a7112c6c-75e9-4a84-aa44-357d0d90ff32/schedule")
      .send({ date: new Date(Date.now() + 10000) })
      .then((res) => expect(res.status).toBe(200));
  });
});
