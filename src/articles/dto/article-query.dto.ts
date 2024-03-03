import { ApiProperty } from '@nestjs/swagger';

export class ArticleQueryDto {
  @ApiProperty({ required: false })
  page?: string;

  @ApiProperty({ required: false })
  sortBy?: string;

  @ApiProperty({ required: false })
  sortOrder?: string;

  @ApiProperty({ required: false })
  filterBy?: string;

  @ApiProperty({ required: false })
  filterContains?: string;
}
