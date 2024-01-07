import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({ description: "El nombre de usuario", required: false })
  username?: string;

  @ApiProperty({ description: "El email del usuario", required: false })
  email?: string;

  @ApiProperty({ description: "La contraseña del usuario", required: false })
  password?: string;

  @ApiProperty({
    description: "Si el usuario es administrador",
    required: false,
  })
  isAdmin?: boolean;
}
