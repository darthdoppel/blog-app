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

    // Login and get JWT token
    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "Admin", password: "12341234" });

    token = response.body.access_token;
  });

  it("/users (GET)", () => {
    return request(app.getHttpServer())
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("/users/:id (GET)", () => {
    return request(app.getHttpServer())
      .get("/users/658d9185e15401877ec79a3f")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("/users (GET) non-admin", async () => {
    // Login as non-admin user and get token
    const response = await request(app.getHttpServer())
      .post("/auth/login")
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
      .post("/auth/login")
      .send({ username: "Tostada", password: "12341234" });

    const nonAdminToken = response.body.access_token;

    // Make request with non-admin token and expect 403
    return request(app.getHttpServer())
      .get("/users/658d9185e15401877ec79a3f")
      .set("Authorization", `Bearer ${nonAdminToken}`)
      .expect(200);
  });
});
