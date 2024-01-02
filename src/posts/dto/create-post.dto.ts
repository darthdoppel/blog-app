import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class CreatePostDto {
  @ApiProperty({ description: "The title of the post" })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "The author of the post" })
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: "The content of the post" })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: "The categories of the post", required: false })
  @IsArray()
  @IsOptional()
  categories?: string[];
}
