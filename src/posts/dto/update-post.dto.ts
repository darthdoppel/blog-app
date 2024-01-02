import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class UpdatePostDto {
  @ApiProperty({ description: "The title of the post", required: false })
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: "The content of the post", required: false })
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: "The categories of the post", required: false })
  @IsArray()
  @IsOptional()
  categories?: string[];
}
