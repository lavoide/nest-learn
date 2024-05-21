import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Role } from 'src/auth/role/role.enum';

export class UserDto {
  @ApiProperty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsEmail()
  @MinLength(6)
  @MaxLength(50)
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @ApiProperty()
  refreshToken?: string;

  @ApiProperty()
  role?: Role;
}
