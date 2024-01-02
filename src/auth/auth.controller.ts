import {
  Controller,
  Request,
  Post,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @ApiOperation({ summary: "Login" })
  @ApiResponse({
    status: 200,
    description: "El usuario ha sido logueado correctamente.",
  })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req) {
    this.logger.log(`El usuario ${req.user._doc.name} ha iniciado sesión`);
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: "Validar usuario" })
  @ApiResponse({
    status: 200,
    description: "El usuario ha sido validado correctamente.",
  })
  @Post("validate")
  async validate(@Request() req) {
    const user = await this.authService.validateUser(
      req.body.username,
      req.body.password,
    );
    if (user) {
      this.logger.log(`El usuario ${user._doc.name} ha sido validado`);
      return user;
    } else {
      this.logger.log(`El usuario no ha sido validado`);
      throw new UnauthorizedException();
    }
  }
}
