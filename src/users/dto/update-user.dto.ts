import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({ description: "The name of the user", required: false })
  name?: string;

  @ApiProperty({ description: "The email of the user", required: false })
  email?: string;

  @ApiProperty({ description: "The password of the user", required: false })
  password?: string;

  @ApiProperty({ description: "Admin status of the user", required: false })
  isAdmin?: boolean;
}
