import { ApiProperty } from '@nestjs/swagger';
import { BookCategoryDto } from './book-category.dto';

export class CreateBookCategoryDto extends BookCategoryDto {
  @ApiProperty()
  bookId: number;

  @ApiProperty()
  categoryId: number;
}
