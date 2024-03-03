import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ArticleDto {
  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  content: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  authorId: number;
}
