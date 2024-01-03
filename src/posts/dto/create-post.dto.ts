import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class CreatePostDto {
  @ApiProperty({ description: "El titulo del post" })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "El contenido del post" })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: "El autor del post", required: false })
  author: string;

  @ApiProperty({ description: "Las categorias del post", required: false })
  @IsArray()
  @IsOptional()
  categories?: string[];
}
