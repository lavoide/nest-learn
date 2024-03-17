import { ApiProperty } from '@nestjs/swagger';
import { ArticleDto } from './article.dto';

export class CreateArticleDto extends ArticleDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  authorId: number;
}
