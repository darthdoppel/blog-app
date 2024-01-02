import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./users/user.module";
import { AuthModule } from "./auth/auth.module";
import { PostsModule } from "./posts/posts.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://elegantfood:1RVrVU3mqQRQ7PT5@leandroblog.xqhhter.mongodb.net/?retryWrites=true&w=majority",
    ),
    UserModule,
    AuthModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
