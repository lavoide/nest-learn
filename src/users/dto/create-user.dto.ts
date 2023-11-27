import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user-dto';
export class CreateUserDto extends UserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
