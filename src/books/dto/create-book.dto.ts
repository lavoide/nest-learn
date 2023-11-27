import { ApiProperty } from '@nestjs/swagger';
import { BookDto } from './book.dto';

export class CreateBookDto extends BookDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  userId: number;
}
