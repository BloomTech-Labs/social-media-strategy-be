const server = require("../../server");
const request = require("supertest");
const db = require("../../../data/dbConfig");
const Lists = require("../listModel");

describe("GET /", () => {
  it('has process.env.NODE_ENV as "testing"', () => {
    expect(process.env.NODE_ENV).toBe("testing");
  });

  it("returns 200 OK", () => {
    return request(server).get("/").expect(200);
  });
});

describe("GET available lists", () => {
  beforeEach(async () => {
    await db("lists").delete();
  });

  test("returns 0 lists", async () => {
    let listTotal;
    listTotal = await Lists.get();
    expect(listTotal).toHaveLength(0);
  });

  test("returns 1 list", async () => {
    listTotal = await Lists.get();
    expect(listTotal).toHaveLength(0);
    await Lists.add({
      id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      created_at: "2020-06-08 12:51:13.821025-07",
      index: 1,
      title: "Mrs. Robinson",
    });
    listTotal = await Lists.get();
    expect(listTotal).toHaveLength(1);
  });

  test("returns 1 found list", async () => {
    listTotal = await Lists.get();
    expect(listTotal).toHaveLength(0);
    await Lists.add({
      id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      created_at: "2020-06-08 12:51:13.821025-07",
      index: 1,
      title: "Mrs. Robinson",
    });
    await Lists.add({
      id: "d2b3833d-08b3-4dd8-96fe-822e3a608d82",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      created_at: "2020-06-08 12:51:21.129036-07",
      index: 2,
      title: "Mr. Big",
    });
    listTotal = await Lists.get();
    expect(listTotal).toHaveLength(2);
    let totalFound;
    totalFound = await Lists.findBy({
      title: "Mrs. Robinson",
    });
    expect(totalFound).toHaveLength(1);
  });

  test("deletes title: Mrs. Robinson", async () => {
    listTotal = await Lists.get();
    expect(listTotal).toHaveLength(0);
    await Lists.add({
      id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      created_at: "2020-06-08 12:51:13.821025-07",
      index: 1,
      title: "Mrs. Robinson",
    });
    await Lists.add({
      id: "d2b3833d-08b3-4dd8-96fe-822e3a608d82",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      created_at: "2020-06-08 12:51:21.129036-07",
      index: 2,
      title: "Mr. Big",
    });
    await Lists.add({
      id: "d376de05-5f1b-4086-93b1-77681ca93614",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      created_at: "2020-06-10 13:39:35.35354-07",
      index: 3,
      title: "Mr. & Mrs. Smith",
    });
    listTotal = await Lists.get();
    expect(listTotal).toHaveLength(3);
    await Lists.remove(
      "fc85a964-eec3-42eb-a076-4d7d2634b321",
      "00ucj17sgcvh8Axqr4x6"
    );
    listTotal = await Lists.get();
    expect(listTotal).toHaveLength(2);
  });

  test('updates list title to "Mr. Smith Goes to Washington"', async () => {
    listTotal = await Lists.get();
    expect(listTotal).toHaveLength(0);
    await Lists.add({
      id: "fc85a964-eec3-42eb-a076-4d7d2634b321",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      created_at: "2020-06-08 12:51:13.821025-07",
      index: 1,
      title: "Mrs. Robinson",
    });
    await Lists.add({
      id: "d2b3833d-08b3-4dd8-96fe-822e3a608d82",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      created_at: "2020-06-08 12:51:21.129036-07",
      index: 2,
      title: "Mr. Big",
    });
    await Lists.add({
      id: "d376de05-5f1b-4086-93b1-77681ca93614",
      okta_uid: "00ucj17sgcvh8Axqr4x6",
      created_at: "2020-06-10 13:39:35.35354-07",
      index: 3,
      title: "Mr. & Mrs. Smith",
    });

    listTotal = await Lists.get();
    expect(listTotal).toHaveLength(3);
    await Lists.update(
      {
        title: "Mr. Smith Goes to Washington",
      },
      "d376de05-5f1b-4086-93b1-77681ca93614",
      "00ucj17sgcvh8Axqr4x6"
    );
    let listObject;
    listObject = await Lists.findBy({
      id: "d376de05-5f1b-4086-93b1-77681ca93614",
    });
    expect(listObject).toHaveLength(1);
    let updateFound;
    updateFound = await Lists.findBy({
      title: "Mr. Smith Goes to Washington",
    });
    expect(updateFound).toHaveLength(1);
  });
});
