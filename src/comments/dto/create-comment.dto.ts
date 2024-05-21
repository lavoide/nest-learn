import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

export class CreateCommentDto extends CommentDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  commenterId: number;

  @ApiProperty()
  articleId: number;
}
