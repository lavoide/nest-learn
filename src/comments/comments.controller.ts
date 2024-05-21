import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Comment } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentQueryDto } from './dto/comment-query.dto';
import { JwtAuthGuard } from '../auth/jwt/jwtAuth.guard';
import RequestWithUser from '../auth/requestWithUser.interface';
import RoleGuard from '../auth/role/role.guard';
import { Role } from '../auth/role/role.enum';

@Controller('comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Request() request: RequestWithUser,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const data = createCommentDto;
    data.commenterId = request.user?.id;
    return this.commentsService.create(data);
  }

  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne({ id: Number(id) });
  }

  @Get('/by-article-id/:articleId')
  getByArticle(
    @Param('articleId') articleId: string,
    @Query() query: CommentQueryDto,
  ): Promise<Comment[]> {
    return this.commentsService.getCommentsForArticlePaginaged(
      Number(articleId),
      Number(query?.cursor),
      Number(query?.pageSize),
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() request: RequestWithUser,
  ): Promise<Comment> {
    return this.commentsService.update(
      request.user,
      Number(id),
      updateCommentDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Request() request: RequestWithUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.commentsService.remove(
      request.user.role as Role,
      Number(id),
      Number(request.user.id),
    );
  }
}
