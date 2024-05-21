import { ApiProperty } from '@nestjs/swagger';
import { OrderDirectionConstants } from '../articles.contsants';
import { IsEnum } from 'class-validator';

export class ArticleQueryDto {
  @ApiProperty({ required: false })
  page?: string;

  @ApiProperty({ required: false })
  sortBy?: string;

  @IsEnum(Object.values(OrderDirectionConstants))
  @ApiProperty({
    type: String,
    required: false,
    enum: Object.values(OrderDirectionConstants),
  })
  sortOrder?: OrderDirectionConstants;

  @ApiProperty({ required: false })
  filterBy?: string;

  @ApiProperty({ required: false })
  filterContains?: string;
}
