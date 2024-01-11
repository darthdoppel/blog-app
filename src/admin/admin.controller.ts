import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Query,
  Body,
  Patch,
  Req,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { IsAdmin } from "../decorators/roles.decorator";
import { Post } from "../posts/schemas/post.schema";
import { UpdatePostDto } from "../posts/dto/update-post.dto";
import { PostsService } from "../posts/posts.service";

@ApiTags("admin")
@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly postsService: PostsService,
  ) {}
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsAdmin(true)
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
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Número máximo de posts a devolver. Valor predeterminado: 10",
    type: Number,
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsAdmin(true)
  @Get("posts")
  async getAllPosts(@Query("limit") limit: number = 10) {
    return this.adminService.getAllPosts(limit);
  }

  @ApiOperation({
    summary: "Actualizar post",
    description:
      "Permite al administrador actualizar cualquier post. Este endpoint solo es accesible para usuarios con rol de administrador.",
  })
  @ApiResponse({
    status: 200,
    description: "El post ha sido actualizado correctamente.",
  })
  @ApiResponse({
    status: 400,
    description:
      "Solicitud incorrecta. El usuario no existe o los datos proporcionados no son válidos.",
  })
  @ApiResponse({
    status: 401,
    description:
      "No autorizado. Solo los usuarios pueden actualizar su propio post o los administradores pueden actualizar cualquier post.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Identificador único del post",
    type: String,
  })
  @ApiBody({
    type: UpdatePostDto,
    description:
      "Datos del post a actualizar. Al ser un PATCH, no es necesario enviar todos los campos.",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtAuthGuard)
  @Patch("/posts/:id")
  async update(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ): Promise<Post> {
    const post = await this.postsService.findOne(id);

    if (!post) {
      throw new NotFoundException();
    }

    if (
      req.user.isAdmin ||
      req.user._id.toString() === post.author.toString()
    ) {
      return this.postsService.update(id, updatePostDto);
    } else {
      throw new UnauthorizedException();
    }
  }

  ///////

  @ApiOperation({
    summary: "Eliminar post",
    description:
      "Permite al administrador eliminar cualquier post. Este endpoint solo es accesible para usuarios con rol de administrador.",
  })
  @ApiResponse({
    status: 200,
    description: "El post ha sido eliminado correctamente.",
  })
  @ApiResponse({
    status: 400,
    description:
      "Solicitud incorrecta. El post no existe o los datos proporcionados no son válidos.",
  })
  @ApiResponse({
    status: 401,
    description:
      "No autorizado. Solo los administradores pueden eliminar cualquier post.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Identificador único del post",
    type: String,
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("id") id: string,
    @Req() req,
  ): Promise<{ post: Post; message: string }> {
    const post = await this.postsService.findOne(id);

    if (!post) {
      throw new NotFoundException();
    }

    if (
      req.user.isAdmin ||
      req.user._id.toString() === post.author.toString()
    ) {
      const deletedPost = await this.postsService.remove(id);
      return {
        post: deletedPost,
        message: "El post ha sido eliminado correctamente",
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
