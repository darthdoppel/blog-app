// user.controller.ts
import { Controller, Post, Body, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.schema";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() user: User) {
    return this.userService.create(user);
  }
}
