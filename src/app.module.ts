import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./users/user.module";
import { PostsModule } from "./posts/posts.module";
import { AdminController } from "./admin/admin.controller";
import { AdminModule } from "./admin/admin.module";
import { AdminService } from "./admin/admin.service";

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://elegantfood:1RVrVU3mqQRQ7PT5@leandroblog.xqhhter.mongodb.net/?retryWrites=true&w=majority",
    ),
    UserModule,
    PostsModule,
    AdminModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService, AdminService],
})
export class AppModule {}
