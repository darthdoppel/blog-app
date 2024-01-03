import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: "El nombre de usuario" })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({ description: "La contraseña del usuario" })
  @IsString()
  @MinLength(8)
  password: string;
}
