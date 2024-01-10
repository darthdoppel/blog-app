import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../app.module";
import * as dotenv from "dotenv";
dotenv.config();

describe("PostsController (e2e)", () => {
  let app: INestApplication;
  let token: string;
  let id: string;

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
      .get("/posts/6596f1fa8fb58425f0f95fc6")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  // Create a new post
  it("/posts (POST)", async () => {
    const createResponse = await request(app.getHttpServer())
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post de Admin",
        content: "Test Content de Admin",
        categories: ["Test Category"],
      })
      .expect(201); // Assuming 201 is the status code for successful creation

    // Extract the ID of the newly created post
    id = createResponse.body._id;
  });

  // GET the newly created post
  it("/posts/:id (GET) newly created", () => {
    return request(app.getHttpServer())
      .get(`/posts/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  // DELETE newly created post
  it("/posts/:id (DELETE) newly created", () => {
    return request(app.getHttpServer())
      .delete(`/posts/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  // try to DELETE a post that is not from the author
  it("/posts/:id (DELETE) not author", async () => {
    // Login as non-author user and get token
    const response = await request(app.getHttpServer())
      .post("/users/login")
      .send({ username: "Tostada", password: "12341234" });

    const nonAuthorToken = response.body.access_token;

    // Make request with non-author token and expect 403
    return request(app.getHttpServer())
      .delete("/posts/659c1bbfef69075e9d11bbb2")
      .set("Authorization", `Bearer ${nonAuthorToken}`)
      .expect(401);
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
      .patch("/posts/659ed8d2594e115ada6a8a5a")
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

    // Make request with non-author token and expect 401
    return request(app.getHttpServer())
      .patch("/posts/659c1bc9ef69075e9d11bbb6")
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
      .get("/posts/search?q=flerken")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  // Filter posts by category
  it("/posts/filter (GET)", () => {
    return request(app.getHttpServer())
      .get("/posts/filter?category=nature")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  // GET posts by author
  it("/posts/users/:userId (GET)", () => {
    return request(app.getHttpServer())
      .get("/posts/user/6596f0a98fb58425f0f95f7d")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
