// user.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Param,
  Req,
  UnauthorizedException,
  Delete,
  Logger,
  Request,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.schema";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IsAdmin } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { Types } from "mongoose";
import { UserResponseDto } from "./dto/user-response.dto";

@ApiTags("usuarios")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger("UserController");
  ///////

  @ApiOperation({
    summary: "Creación de usuario",
    description: "Permite a un usuario registrarse en la aplicación.",
  })
  @ApiResponse({
    status: 200,
    description: "El usuario ha sido creado correctamente.",
    schema: {
      example: {
        id: "6596d4df4abf28b6fd5305c5",
        username: "Mitski",
        email: "Mitski@gmail.com",
        isAdmin: false,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "El usuario ya existe.",
  })
  @ApiBody({
    description: "Datos del usuario a crear",
    type: User,
  })
  @Post()
  async create(@Body() user: User): Promise<UserResponseDto> {
    const newUser = await this.userService.create(user);
    return {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    };
  }

  ////////

  @ApiOperation({
    summary: "Login",
    description:
      "Autenticación de usuario. Requiere nombre de usuario y contraseña.",
  })
  @ApiResponse({
    status: 201,
    description: "El usuario ha sido logueado correctamente.",
    schema: {
      example: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Credenciales inválidas.",
  })
  @ApiBody({
    description: "Credenciales para el login",
    type: LoginDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req) {
    this.logger.log(`El usuario ${req.user._doc.name} ha iniciado sesión`);
    return this.userService.login(req.user);
  }

  @ApiOperation({
    summary: "Obtener todos los usuarios",
    description:
      "Este endpoint solo es accesible para usuarios con rol de administrador.",
  })
  @ApiResponse({ status: 200, description: "Devuelve todos los usuarios." })
  @ApiResponse({ status: 401, description: "No autorizado." })
  @ApiResponse({ status: 404, description: "Usuarios no encontrados." })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsAdmin(true)
  @Get()
  async findAll(): Promise<Pick<User, "id" | "username" | "email">[]> {
    return this.userService.findAll();
  }

  ////////

  @ApiOperation({ summary: "Obtener usuario por ID" })
  @ApiResponse({ status: 200, description: "Devuelve el usuario." })
  @ApiResponse({ status: 401, description: "No autorizado." })
  @ApiResponse({ status: 404, description: "Usuario no encontrado." })
  @ApiParam({
    name: "id",
    required: true,
    description: "Identificador único del usuario",
    type: String,
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id") id: string,
  ): Promise<Pick<User, "id" | "username" | "email">> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID de usuario inválido");
    }
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    return {
      id: user._id,
      username: user.username,
      email: user.email,
    };
  }

  ////////

  @ApiOperation({
    summary: "Actualización de usuario",
    description:
      "Permite a un usuario actualizar su propio perfil o a un administrador actualizar cualquier perfil.",
  })
  @ApiResponse({
    status: 200,
    description: "El usuario ha sido actualizado correctamente.",
  })
  @ApiResponse({
    status: 401,
    description:
      "No autorizado. Solo los usuarios pueden actualizar su propio perfil o los administradores pueden actualizar cualquier perfil.",
  })
  @ApiResponse({
    status: 404,
    description: "Usuario no encontrado.",
  })
  @ApiResponse({
    status: 400,
    description: "Datos inválidos.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Identificador único del usuario a actualizar.",
    type: String,
  })
  @ApiBody({
    description:
      "Datos del usuario para actualizar. Incluye campos como nombre, correo electrónico, etc. Al ser un PATCH, no es necesario enviar todos los campos.",
    type: UpdateUserDto,
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<User> {
    if (req.user.isAdmin || req.user._id.toString() === id) {
      return this.userService.update(id, updateUserDto);
    } else {
      throw new UnauthorizedException();
    }
  }

  ////////

  @ApiOperation({
    summary: "Eliminar usuario",
    description:
      "Este endpoint solo es accesible para usuarios con rol de administrador.",
  })
  @ApiResponse({
    status: 200,
    description: "El usuario ha sido eliminado correctamente.",
  })
  @ApiResponse({
    status: 401,
    description: "No autorizado.",
  })
  @ApiResponse({
    status: 404,
    description: "Usuario no encontrado.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Identificador único del usuario",
    type: String,
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsAdmin(true)
  @Delete(":id")
  async delete(
    @Param("id") id: string,
  ): Promise<{ message: string; user: User }> {
    const user = await this.userService.delete(id);
    return { message: "Usuario eliminado correctamente", user };
  }
}
