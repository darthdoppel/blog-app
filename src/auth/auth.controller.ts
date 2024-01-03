import {
  Controller,
  Request,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

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
