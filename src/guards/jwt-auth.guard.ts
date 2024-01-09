import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];

    if (err || !user) {
      if (authHeader) {
        throw new UnauthorizedException(
          "Su token es inválido o ha expirado. Por favor, inicie sesión de nuevo.",
        );
      } else {
        throw new UnauthorizedException(
          "Autorización requerida. Por favor, inicie sesión.",
        );
      }
    }
    return user;
  }
}
