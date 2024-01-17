import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument } from "./schemas/post.schema";
import { UpdatePostDto } from "./dto/update-post.dto";
import { UserService } from "../users/user.service";
import { User } from "src/users/user.schema";
import { Request } from "express";
import { Types } from "mongoose";

export interface RequestWithUser extends Request {
  user: {
    username: string;
    sub: string;
    isAdmin: boolean;
    _id: string;
  };
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly userService: UserService,
  ) {}

  async create(createPostDto: any, req: RequestWithUser): Promise<Post> {
    const authorId = new Types.ObjectId(req.user._id);
    let author: User;
    try {
      author = await this.userService.findOne(authorId.toString());
    } catch (error) {
      throw new BadRequestException(`ID de usuario no válido`);
    }
    if (!author) {
      throw new NotFoundException(`Usuario #${authorId} no encontrado`);
    }
    const createdPost = new this.postModel(createPostDto);
    createdPost.author = authorId;
    return createdPost.save();
  }

  async findAll(limit: number = 10): Promise<{ posts: Post[]; count: number }> {
    const posts = await this.postModel.find().limit(limit).exec();
    console.log("findAll", posts);
    const count = posts.length;

    return { posts, count };
  }

  async findByAuthor(author: string, limit: number = 10) {
    const authorId = new Types.ObjectId(author);
    return this.postModel.find({ author: authorId }).limit(limit).exec();
  }

  async findOne(id: string): Promise<Post> {
    return this.postModel.findById(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      updatePostDto,
      { new: true },
    );
    if (!updatedPost) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return updatedPost;
  }

  async remove(id: string): Promise<Post> {
    return this.postModel.findOneAndDelete({ _id: id }).exec();
  }

  async findByUser(userId: string): Promise<Post[]> {
    return this.postModel.find({ author: userId }).exec();
  }

  async search(query: string, limit: number = 10): Promise<Post[] | string> {
    const results = await this.postModel
      .find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(Number(limit))
      .exec();

    if (results.length === 0) {
      return "No se encontraron resultados";
    }

    return results;
  }

  async filter(category: string, author: string): Promise<Post[] | string> {
    const filter = {};
    if (category) {
      filter["categories"] = { $regex: new RegExp(category, "i") };
    }
    if (author) {
      if (Types.ObjectId.isValid(author)) {
        const authorExists = await this.userService.findOne(author);
        if (!authorExists) {
          throw new NotFoundException(`Autor con ID ${author} no encontrado`);
        }
        filter["author"] = new Types.ObjectId(author);
      } else {
        throw new BadRequestException(`ID de autor inválido: ${author}`);
      }
    }

    const results = await this.postModel.find(filter).exec();

    if (results.length === 0) {
      return "Sin resultados para el filtro aplicado";
    }

    return results;
  }
}
