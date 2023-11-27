import { ApiProperty } from '@nestjs/swagger';

export class BookCategoryDto {
  @ApiProperty()
  bookId: number;

  @ApiProperty()
  categoryId: number;
}
