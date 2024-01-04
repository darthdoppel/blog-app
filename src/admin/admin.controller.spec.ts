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

  it("should delete a user by id", async () => {
    const createResponse = await request(app.getHttpServer())
      .post("/users")
      .send({
        name: "Test User",
        password: "12341234",
        email: "testuser@gmail.com",
      });

    expect(createResponse.status).toBe(201);

    const id = createResponse.body.id;

    await request(app.getHttpServer())
      .delete(`/admin/users/${id}`)
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
