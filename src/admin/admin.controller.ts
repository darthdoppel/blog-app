import { Controller, Get, Delete, Param, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { IsAdmin } from "src/decorators/roles.decorator";

@ApiTags("admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
  @Get("users")
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @ApiOperation({
    summary: "Eliminar un usuario",
    description:
      "Este endpoint solo es accesible para usuarios con rol de administrador.",
  })
  @ApiResponse({ status: 200, description: "Usuario eliminado." })
  @ApiResponse({ status: 401, description: "No autorizado." })
  @ApiResponse({ status: 404, description: "Usuario no encontrado." })
  @ApiBearerAuth("JWT")
  @Delete("users/:id")
  deleteUser(@Param("id") id: string) {
    return this.adminService.deleteUser(id);
  }

  @ApiOperation({
    summary: "Obtener todos los posts",
    description:
      "Este endpoint solo es accesible para usuarios con rol de administrador.",
  })
  @ApiResponse({ status: 200, description: "Devuelve todos los posts." })
  @ApiResponse({ status: 401, description: "No autorizado." })
  @ApiResponse({ status: 404, description: "Posts no encontrados." })
  @ApiBearerAuth("JWT")
  @Get("posts")
  getAllPosts() {
    return this.adminService.getAllPosts();
  }
}
