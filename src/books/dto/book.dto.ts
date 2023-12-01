import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  ownerId?: number;
}
