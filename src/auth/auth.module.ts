// auth.module.ts
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./local.strategy";
import { LocalAuthGuard } from "./local-auth.guard";
import { UserService } from "src/users/user.service";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
  ],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, UserService],
  controllers: [AuthController],
  exports: [UserService],
})
export class AuthModule {}
