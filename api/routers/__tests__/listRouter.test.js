const request = require("supertest");
const server = require("../../server.js");
const db = require("../../../data/dbConfig");

beforeAll(() => db.seed.run());

describe("GET /api/lists", () => {
  it("returns 200", () => {
    request(server)
      .get("/api/lists/")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the correct number of lists", () => {
    request(server)
      .get("/api/lists/")
      .then((res) => {
        expect(res.body.length).toBe(3);
      });
  });

  it("only returns lists with the user's okta_uid", () => {
    request(server)
      .get("/api/lists/")
      .then((res) => {
        expect(
          res.body.filter((list) => list.okta_uid === "00ucj17sgcvh8Axqr4x6")
            .length
        ).toBe(res.body.length);
      });
  });
});

describe("GET /api/lists/:id", () => {
  it("returns 200 for a list that exists belonging to the logged in user", () => {
    request(server)
      .get("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns a list that actually belongs to the logged in user", () => {
    request(server)
      .get("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321")
      .then((res) => {
        expect(res.body.okta_uid).toBe("00ucj17sgcvh8Axqr4x6");
      });
  });

  it("returns 404 when trying to access another user's list", () => {
    request(server)
      .get("/api/lists/013e4ab9-77e0-48de-9efe-4d96542e791f")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("returns 500 for an invalid id", () => {
    request(server)
      .get("/api/lists/foo")
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });
});

describe("GET /api/lists/:id/posts", () => {
  it("returns 200 for a list that exists belonging to the logged in user", () => {
    request(server)
      .get("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321/posts")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns an array", () => {
    request(server)
      .get("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321/posts")
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it("returns the correct number of posts", () => {
    request(server)
      .get("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321/posts")
      .then((res) => {
        expect(res.body.length).toBe(3);
      });
  });

  it("returns 404 when trying to access another user's list", () => {
    request(server)
      .get("/api/lists/013e4ab9-77e0-48de-9efe-4d96542e791f")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("returns 500 for an invalid id", () => {
    request(server)
      .get("/api/lists/foo")
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });
});

describe("POST /api/lists", () => {
  it("returns 201 on success", () => {
    request(server)
      .post("/api/lists/")
      .send({ title: "hello" })
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });

  it("returns the list with the correct index and title", async () => {
    let response;
    try {
      response = await request(server)
        .post("/api/lists/")
        .send({ title: "hello again" });
    } catch (err) {
      console.log(err);
    }

    expect(response.body.title).toBe("hello again");
    expect(response.body.index).toBe(4);
  });

  it("returns 400 when no title is provided", () => {
    request(server)
      .post("/api/lists/")
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
});

describe("POST /api/lists/:id/posts", () => {
  it("returns 201 on success", () => {
    request(server)
      .post("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321/posts")
      .send({ post_text: "new post" })
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });

  it("returns the new post with the correct index and post_text", async () => {
    let response;

    try {
      response = await request(server)
        .post("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321/posts")
        .send({ post_text: "another new post" });
    } catch (err) {
      console.log(err);
    }

    expect(response.body.index).toBe(4);
    expect(response.body.post_text).toBe("another new post");
  });

  it("returns 400 when no post_text is provided", () => {
    request(server)
      .post("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321/posts")
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it("returns 404 when trying to post to a list that does not belong to logged in user", () => {
    request(server)
      .post("/api/lists/013e4ab9-77e0-48de-9efe-4d96542e791f/posts")
      .send({ post_text: "trying to post to another user's list" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("PUT /api/lists/:id", () => {
  it("returns 200 on success", () => {
    request(server)
      .put("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321")
      .send({ title: "updated title" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the updated list", () => {
    request(server)
      .put("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321")
      .send({ title: "updated title again" })
      .then((res) => {
        expect(res.body.title).toBe("updated title again");
      });
  });

  it("returns 404 when trying to update a list that does not belong to logged in user", () => {
    request(server)
      .put("/api/lists/013e4ab9-77e0-48de-9efe-4d96542e791f")
      .send({ title: "trying to update another user's list" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("PATCH /api/lists/:id", () => {
  it("returns 200 on success", () => {
    request(server)
      .patch("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321")
      .send({ title: "updated title" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the updated list", () => {
    request(server)
      .patch("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321")
      .send({ title: "updated title again" })
      .then((res) => {
        expect(res.body.title).toBe("updated title again");
      });
  });

  it("returns 404 when trying to update a list that does not belong to logged in user", () => {
    request(server)
      .patch("/api/lists/013e4ab9-77e0-48de-9efe-4d96542e791f")
      .send({ title: "trying to update another user's list" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("DELETE /api/lists/:id", () => {
  it("returns 200 on success", () => {
    request(server)
      .delete("/api/lists/fc85a964-eec3-42eb-a076-4d7d2634b321")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns the number of deleted lists", () => {
    request(server)
      .delete("/api/lists/d2b3833d-08b3-4dd8-96fe-822e3a608d82")
      .then((res) => {
        expect(res.body.deleted).toBe(1);
      });
  });

  it("returns 404 when trying to delete a list that does not belong to logged in user", () => {
    request(server)
      .delete("/api/lists/013e4ab9-77e0-48de-9efe-4d96542e791f")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});
