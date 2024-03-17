import { ApiProperty } from '@nestjs/swagger';

export class CommentQueryDto {
  @ApiProperty({ required: false })
  cursor?: string;
  @ApiProperty({ required: false })
  pageSize?: number;
}
