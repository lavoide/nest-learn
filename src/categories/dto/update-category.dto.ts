import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class UpdateCategoryDto extends PartialType(CategoryDto) {
  @ApiProperty()
  name: string;
}
