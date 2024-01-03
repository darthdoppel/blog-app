import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./schemas/post.schema";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { UserModule } from "../users/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UserModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
