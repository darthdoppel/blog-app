import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../app.module";
import * as dotenv from "dotenv";
dotenv.config();

describe("PostsController (e2e)", () => {
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

  it("should get all users", () => {
    return request(app.getHttpServer())
      .get("/admin/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should delete users by ids", async () => {
    const createResponse1 = await request(app.getHttpServer())
      .post("/users")
      .send({
        username: "Test User1",
        password: "12341234",
        email: "testuser1@gmail.com",
      });

    const createResponse2 = await request(app.getHttpServer())
      .post("/users")
      .send({
        username: "Test User2",
        password: "12341234",
        email: "testuser2@gmail.com",
      });

    expect(createResponse1.status).toBe(201);
    expect(createResponse2.status).toBe(201);

    const ids = [createResponse1.body.id, createResponse2.body.id];

    await request(app.getHttpServer())
      .delete("/admin/users")
      .send(ids)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should get all the posts", () => {
    return request(app.getHttpServer())
      .get("/admin/posts")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });
});
