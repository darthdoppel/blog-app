import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @ApiProperty({
    required: true,
    example: "John Doe",
    description: "Nombre del usuario",
  })
  @Prop({ required: true })
  username: string;

  @ApiProperty({
    required: true,
    example: "john.doe@example.com",
    description: "Correo electrónico del usuario",
  })
  @Prop({ required: true })
  email: string;

  @ApiProperty({
    required: true,
    example: "password123",
    description: "Contraseña del usuario",
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    required: false,
    example: false,
    description:
      "Indica si el usuario es administrador. Por defecto es 'false'.",
  })
  @Prop({ default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
