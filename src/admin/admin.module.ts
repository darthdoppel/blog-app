import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UserModule } from "../users/user.module";
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [UserModule, PostsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
