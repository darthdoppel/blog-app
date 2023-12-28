// user.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Param,
  Req,
  UnauthorizedException,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.schema";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IsAdmin } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsAdmin(true)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: "Get user by id" })
  @ApiResponse({ status: 200, description: "The found record" })
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id") id: string,
  ): Promise<Pick<User, "id" | "name" | "email"> | undefined> {
    const user = await this.userService.findOne(id);
    if (!user) {
      return undefined;
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  @ApiOperation({ summary: "Create user" })
  @ApiResponse({
    status: 201,
    description: "The record has been successfully created.",
  })
  @Post()
  async create(@Body() user: User) {
    return this.userService.create(user);
  }

  @ApiOperation({ summary: "Update user" })
  @ApiResponse({
    status: 200,
    description: "The record has been successfully updated.",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<User> {
    if (req.user.isAdmin || req.user._id.toString() === id) {
      return this.userService.update(id, updateUserDto);
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsAdmin(true)
  @Delete(":id")
  async delete(
    @Param("id") id: string,
  ): Promise<{ message: string; user: User }> {
    const user = await this.userService.delete(id);
    return { message: "Usuario eliminado correctamente", user };
  }
}
