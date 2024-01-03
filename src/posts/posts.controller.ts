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

  @ApiOperation({ summary: "Obtener todos los posts" })
  @ApiResponse({
    status: 200,
    description: "Devuelve todos los posts.",
  })
  @Get()
  async findAll(@Query("limit") limit: number): Promise<Post[]> {
    return this.postsService.findAll(limit);
  }

  ///////

  @ApiOperation({ summary: "Buscar posts" })
  @ApiResponse({
    status: 200,
    description: "Devuelve los resultados de la búsqueda de posts.",
  })
  @Get("/search")
  async search(
    @Query("q") query: string,
    @Query("limit") limit: number = 10,
  ): Promise<Post[]> {
    return this.postsService.search(query, limit);
  }

  ///////

  @ApiOperation({ summary: "Filtrar posts" })
  @ApiResponse({
    status: 200,
    description: "Devuelve los resultados del filtrado de posts.",
  })
  @Get("/filter")
  async filter(
    @Query("category") category: string,
    @Query("author") author: string,
    @Query("limit") limit: number = 10,
  ): Promise<Post[]> {
    return this.postsService.filter(category, author, limit);
  }

  ///////

  @ApiOperation({ summary: "Obtener post por id" })
  @ApiResponse({ status: 200, description: "Devuelve el post." })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  ///////

  @ApiOperation({ summary: "Actualizar post" })
  @ApiResponse({
    status: 200,
    description: "El post ha sido actualizado correctamente.",
  })
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

  @ApiOperation({ summary: "Eliminar post" })
  @ApiResponse({
    status: 200,
    description: "El post ha sido eliminado correctamente.",
  })
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

  @ApiOperation({ summary: "Obtener posts de un usuario" })
  @ApiResponse({
    status: 200,
    description: "Devuelve los posts del usuario.",
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
