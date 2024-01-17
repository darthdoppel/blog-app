import { Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { PostsService } from "../posts/posts.service";
import { Post } from "src/posts/schemas/post.schema";

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

  async getAllPosts(userId: string, limit: number = 10) {
    const user = await this.usersService.findOne(userId);
    if (user.isAdmin) {
      return this.postsService.findAll(limit);
    } else {
      return this.postsService.findByAuthor(userId, limit);
    }
  }

  async patchPost(id: string, updateData: Partial<Post>) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post #${id} no encontrado`);
    }
    return this.postsService.update(id, updateData);
  }

  async deletePost(id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post #${id} no encontrado`);
    }
    return this.postsService.remove(id);
  }
}
