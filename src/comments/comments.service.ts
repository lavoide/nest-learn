import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { COMMENT_ERRORS, PAGE_SIZE_COMMENT } from './comment.contsants';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCommentDto): Promise<Comment> {
    return this.prisma.comment.create({
      data,
    });
  }

  async findAll(): Promise<Comment[]> {
    return this.prisma.comment.findMany();
  }

  async findOne(id: number): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (comment) {
      return comment;
    }
    throw new HttpException(COMMENT_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async getCommentsForArticlePaginaged(
    articleId: number,
    cursor: number,
    pageSize?: number,
  ): Promise<Comment[]> {
    if (!cursor) {
      return this.prisma.comment.findMany({
        take: pageSize ?? PAGE_SIZE_COMMENT,
        where: {
          articleId,
        },
      });
    }
    return this.prisma.comment.findMany({
      take: PAGE_SIZE_COMMENT,
      skip: 1,
      where: {
        articleId,
      },
      cursor: {
        id: cursor,
      },
    });
  }

  async update(id: number, data: UpdateCommentDto): Promise<Comment> {
    await this.prisma.comment.findFirstOrThrow({
      where: { id },
    });
    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Comment> {
    await this.prisma.comment.findFirstOrThrow({
      where: { id },
    });
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
