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

  it("/posts (GET)", () => {
    return request(app.getHttpServer())
      .get("/posts")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  // GET posts but with limit

  it("/posts/:id (GET) limit", () => {
    return request(app.getHttpServer())
      .get("/posts?limit=1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("/posts/:id (GET)", () => {
    return request(app.getHttpServer())
      .get("/posts/658dc74e74722faf97232caa")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("/posts (POST)", () => {
    return request(app.getHttpServer())
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        content: "Test Content",
        categories: ["Test Category"],
      })
      .expect(201);
  });

  // PATCH request for updating post if the user is the author
  it("/posts/:id (PATCH) author", async () => {
    // Login as author user and get token
    const response = await request(app.getHttpServer())
      .post("/users/login")
      .send({ username: "Flerken", password: "12341234" });

    const authorToken = response.body.access_token;

    // Make request with author token and expect 200
    return request(app.getHttpServer())
      .patch("/posts/658dc74e74722faf97232caa")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        title: "Test Post",
        content: "Test Content",
        categories: ["Test Category"],
      })
      .expect(200);
  });

  // PATCH request for updating post if the user is not the author
  it("/posts/:id (PATCH) non-author", async () => {
    // Login as non-author user and get token
    const response = await request(app.getHttpServer())
      .post("/users/login")
      .send({ username: "Tostada", password: "12341234" });

    const nonAuthorToken = response.body.access_token;

    // Make request with non-author token and expect 403
    return request(app.getHttpServer())
      .patch("/posts/658dc74e74722faf97232caa")
      .set("Authorization", `Bearer ${nonAuthorToken}`)
      .send({
        title: "Test Post",
        content: "Test Content",
        categories: ["Test Category"],
      })
      .expect(401);
  });

  // Search posts by title, content, etc.
  it("/posts/search (GET)", () => {
    return request(app.getHttpServer())
      .get("/posts/search?q=tostada")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  // Search posts by author
  it("/posts/search (GET) by author", () => {
    return request(app.getHttpServer())
      .get("/posts/user/658d99d70d8cc33e9c252d18")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
