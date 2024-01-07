// user.service.ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = {
      username: user._doc.name,
      sub: user._doc._id,
      isAdmin: user._doc.isAdmin,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findAll(): Promise<Pick<User, "id" | "username" | "email">[]> {
    return this.userModel.find().select("_id username email").exec();
  }

  async findAllAdmin(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userModel.findById(id);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username: username });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.isAdmin !== undefined) {
      user.isAdmin = updateUserDto.isAdmin;
    }
    return user.save();
  }

  async delete(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await this.userModel.deleteOne({ _id: id });
    return user;
  }
}
