import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
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
