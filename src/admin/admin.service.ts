import { Injectable } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { PostsService } from "../posts/posts.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UserService,
    private readonly postsService: PostsService,
  ) {}

  async getAllUsers() {
    return this.usersService.findAllAdmin();
  }

  async deleteUser(id: string) {
    return this.usersService.delete(id);
  }

  async getAllPosts() {
    return this.postsService.findAll(10);
  }
}
