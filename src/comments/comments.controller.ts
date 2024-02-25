import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(Number(id), updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.remove(Number(id));
  }
}
