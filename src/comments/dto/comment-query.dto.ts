import { ApiProperty } from '@nestjs/swagger';

export class CommentQueryDto {
  @ApiProperty({ required: false })
  cursor?: string;
}
