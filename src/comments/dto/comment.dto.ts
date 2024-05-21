import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  commenterId?: number;

  @ApiProperty()
  articleId: number;
}
