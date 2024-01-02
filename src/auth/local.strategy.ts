// local.strategy.ts
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  private readonly logger = new Logger(LocalStrategy.name);

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (user) {
      this.logger.log(`Usuario ${username} validado`);
      return user;
    } else {
      this.logger.log(`Usuario ${username} no validado`);
      throw new UnauthorizedException("Usuario o contraseña incorrectos");
    }
  }
}
