import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getModelToken } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";

describe("UserService", () => {
  let userService: UserService;
  let userModel: any;

  // Mock JwtService
  const mockJwtService = () => ({
    sign: jest.fn(),
  });

  // Mock UserModel
  const mockUserModel = () => ({
    findById: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken("User"),
          useFactory: mockUserModel,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get(getModelToken("User"));
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  describe("findOne", () => {
    it("should return a user if one is found", async () => {
      const userId = "someId";
      const expectedUser = {
        _id: userId,
        username: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
      };

      userModel.findById.mockResolvedValue(expectedUser);
      const user = await userService.findOne(userId);
      expect(user).toEqual(expectedUser);
    });

    it("should return null if no user is found", async () => {
      const userId = "someId";

      userModel.findById.mockResolvedValue(null);
      const user = await userService.findOne(userId);
      expect(user).toBeNull();
    });
  });
});
