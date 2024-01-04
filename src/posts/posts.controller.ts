import {
  Controller,
  Get,
  Post as PostMethod,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  UnauthorizedException,
  Query,
} from "@nestjs/common";
import { PostsService, RequestWithUser } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { Post } from "./schemas/post.schema";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: "Crear post",
    description:
      "Crea un nuevo post. El ID del autor se extrae del token de autenticación JWT proporcionado. No es necesario enviar el ID del autor en el cuerpo de la solicitud.",
  })
  @ApiResponse({
    status: 201,
    description: "El post ha sido creado correctamente.",
  })
  @ApiResponse({
    status: 400,
    description:
      "Solicitud incorrecta. El usuario no existe o los datos proporcionados no son válidos.",
  })
  @ApiResponse({
    status: 401,
    description: "No autorizado. Se requiere un token de autenticación válido.",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtAuthGuard)
  @PostMethod()
  create(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.create(createPostDto, req);
  }

  ///////

  @ApiOperation({
    summary: "Obtener todos los posts",
    description:
      "Recupera todos los posts con la opción de paginación. Si no se especifica un límite, el valor predeterminado es 10.",
  })
  @ApiResponse({
    status: 200,
    description: "Devuelve una lista de posts.",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Número máximo de posts a devolver. Valor predeterminado: 10",
    type: Number,
  })
  @Get()
  async findAll(@Query("limit") limit: number = 10): Promise<Post[]> {
    return this.postsService.findAll(limit);
  }

  ///////

  @ApiOperation({ summary: "Buscar posts" })
  @ApiResponse({
    status: 200,
    description: "Devuelve los resultados de la búsqueda de posts.",
  })
  @ApiQuery({
    name: "q",
    required: true,
    description: "El término de búsqueda para los posts",
    type: String,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description:
      "Número máximo de posts a devolver en los resultados de búsqueda. Valor predeterminado: 10",
    type: Number,
  })
  @Get("/search")
  async search(
    @Query("q") query: string,
    @Query("limit") limit: number = 10,
  ): Promise<Post[]> {
    return this.postsService.search(query, limit);
  }

  ///////

  @ApiOperation({
    summary: "Filtrar posts.",
    description: "No es necesario completar ambos campos.",
  })
  @ApiResponse({
    status: 200,
    description:
      "Devuelve los resultados del filtrado de posts por categoría y/o autor.",
  })
  @ApiQuery({
    name: "category",
    required: false,
    description: "La categoría por la que filtrar",
    type: String,
  })
  @ApiQuery({
    name: "author",
    required: false,
    description: "El ID del autor por el que filtrar",
    type: String,
  })
  @Get("/filter")
  async filter(
    @Query("category") category: string,
    @Query("author") author: string,
  ): Promise<Post[]> {
    return this.postsService.filter(category, author);
  }

  ///////

  @ApiOperation({ summary: "Obtener post por ID" })
  @ApiResponse({ status: 200, description: "Devuelve el post." })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  ///////

  @ApiOperation({
    summary: "Actualizar post",
    description:
      "Permite a un usuario actualizar su propio post o a un administrador actualizar cualquier post.",
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
  @Patch(":id")
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
      "Permite a un usuario eliminar su propio post o a un administrador eliminar cualquier post.",
  })
  @ApiResponse({
    status: 200,
    description: "El post ha sido eliminado correctamente.",
  })
  @ApiResponse({
    status: 400,
    description:
      "Solicitud incorrecta. El usuario no existe o los datos proporcionados no son válidos.",
  })
  @ApiResponse({
    status: 401,
    description:
      "No autorizado. Solo los usuarios pueden eliminar su propio post o los administradores pueden eliminar cualquier post.",
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

  ///////

  @ApiOperation({
    summary: "Obtener posts de un usuario",
    description: "Devuelve todos los posts de un usuario.",
  })
  @ApiResponse({
    status: 200,
    description: "Devuelve los posts del usuario.",
  })
  @ApiResponse({
    status: 404,
    description: "No se encontraron posts para el usuario.",
  })
  @ApiParam({
    name: "userId",
    required: true,
    description: "Identificador único del usuario",
    type: String,
  })
  @Get("user/:userId")
  async findByUser(
    @Param("userId") userId: string,
  ): Promise<{ posts: Post[]; message: string }> {
    const posts = await this.postsService.findByUser(userId);

    if (posts.length === 0) {
      return {
        posts: [],
        message: "No se encontraron posts para el usuario.",
      };
    } else {
      return {
        posts: posts,
        message: "Posts encontrados.",
      };
    }
  }
}
