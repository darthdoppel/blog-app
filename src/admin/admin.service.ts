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

  async deleteUsers(ids: string[]) {
    return this.usersService.deleteMany({ _id: { $in: ids } });
  }

  async getAllPosts(userId: string, limit: number = 10) {
    const user = await this.usersService.findOne(userId);
    if (user.isAdmin) {
      return this.postsService.findAll(limit);
    } else {
      return this.postsService.findByAuthor(userId, limit);
    }
  }
}
