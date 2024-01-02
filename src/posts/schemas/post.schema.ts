import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  categories: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Add text index to title and content fields
PostSchema.index({ title: "text", content: "text" });
