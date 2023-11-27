import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { BookCategoryDto } from './book-category.dto';

export class UpdateBookCategoryDto extends PartialType(BookCategoryDto) {
  @ApiProperty()
  bookId: number;

  @ApiProperty()
  categoryId: number;
}
