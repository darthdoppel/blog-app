import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Query,
  Req,
  Body,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { IsAdmin } from "../decorators/roles.decorator";
import { PostsService } from "../posts/posts.service";

interface RequestWithUser extends Request {
  user: {
    id: string;
    isAdmin: boolean;
  };
}

class DeleteUsersResponse {
  @ApiProperty({
    description: "Mensaje de confirmación",
    example: "2 usuarios han sido eliminados",
  })
  message: string;
}

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
    summary: "Eliminar más de un usuario",
    description:
      "Este endpoint solo es accesible para usuarios con rol de administrador.",
  })
  @ApiOkResponse({
    description: "Usuarios eliminados correctamente.",
    type: DeleteUsersResponse,
  })
  @ApiResponse({ status: 401, description: "No autorizado." })
  @ApiResponse({ status: 404, description: "Usuarios no encontrados." })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsAdmin(true)
  @Delete("users")
  async deleteUsers(@Body() ids: string[]) {
    if (!ids.length) {
      throw new BadRequestException("No se han proporcionado IDs.");
    }

    const result = await this.adminService.deleteUsers(ids);

    if (result.deletedCount === 0) {
      throw new NotFoundException("No se han encontrado usuarios.");
    }

    return {
      message: `${result.deletedCount} usuarios han sido eliminados`,
    };
  }

  @ApiOperation({
    summary: "Obtener todos los posts",
    description:
      "Este endpoint es para recibir posts de un usuario concreto para su moderación (editar o borrar sus propios posts), y en el caso de los administradores, para recibir todos los posts de todos los usuarios.",
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
  @Get("posts")
  async getAllPosts(
    @Req() req: RequestWithUser,
    @Query("limit") limit: number = 10,
  ) {
    const authorId = req.user.id;
    return this.adminService.getAllPosts(authorId, limit);
  }
}
