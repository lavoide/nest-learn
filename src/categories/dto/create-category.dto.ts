import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class CreateCategoryDto extends CategoryDto {
  @ApiProperty()
  name: string;
}
