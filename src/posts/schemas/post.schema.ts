import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document, Types } from "mongoose";

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @ApiProperty({ description: "El título del post.", required: true })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: "El ID del autor del post.",
    type: String,
    required: true,
  })
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  author: Types.ObjectId;

  @ApiProperty({ description: "El contenido del post.", required: true })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: "Las categorías del post.",
    type: [String],
    required: true,
  })
  @Prop({ type: [String], required: true })
  categories: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Add text index to title and content fields
PostSchema.index({ title: "text", content: "text" });
