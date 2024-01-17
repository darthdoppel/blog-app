import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../app.module";
import * as dotenv from "dotenv";
dotenv.config();

describe("UserController (e2e)", () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login and get JWT admin token
    const response = await request(app.getHttpServer())
      .post("/users/login")
      .send({ username: "Admin", password: "12341234" });

    token = response.body.access_token;
  });

  it("should create and delete a user", async () => {
    const uniqueId = Date.now();

    const createResponse = await request(app.getHttpServer())
      .post("/users")
      .send({
        username: `Test User ${uniqueId}`,
        password: "12341234",
        email: `testuser${uniqueId}@gmail.com`,
      });

    expect(createResponse.status).toBe(201);

    // Delete created user
    const ids = [createResponse.body.id];

    await request(app.getHttpServer())
      .delete(`/admin/users`)
      .send(ids)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("/users (GET)", () => {
    return request(app.getHttpServer())
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("/users/:id (GET)", () => {
    return request(app.getHttpServer())
      .get("/users/6596f0ae8fb58425f0f95f7f")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("/users (GET) non-admin", async () => {
    // Login as non-admin user and get token
    const response = await request(app.getHttpServer())
      .post("/users/login")
      .send({ username: "Tostada", password: "12341234" });

    const nonAdminToken = response.body.access_token;

    // Make request with non-admin token and expect 403
    return request(app.getHttpServer())
      .get("/users")
      .set("Authorization", `Bearer ${nonAdminToken}`)
      .expect(403);
  });

  it("/users/:id (GET) non-admin", async () => {
    // Login as non-admin user and get token
    const response = await request(app.getHttpServer())
      .post("/users/login")
      .send({ username: "Tostada", password: "12341234" });

    const nonAdminToken = response.body.access_token;

    // Make request with non-admin token and expect 200
    return request(app.getHttpServer())
      .get("/users/6596f0ae8fb58425f0f95f7f")
      .set("Authorization", `Bearer ${nonAdminToken}`)
      .expect(200);
  });
});
