// comments.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { COMMENT_ERRORS } from './comment.contsants';

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

  async update(id: number, data: UpdateCommentDto): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new HttpException(COMMENT_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new HttpException(COMMENT_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
