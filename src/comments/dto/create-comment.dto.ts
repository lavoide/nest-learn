import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

export class CreateCommentDto extends CommentDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  commenterId: number;

  @ApiProperty()
  articleId: number;
}
