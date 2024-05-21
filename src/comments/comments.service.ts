import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Comment, Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { COMMENT_ERRORS, PAGE_SIZE_COMMENT } from './comment.contsants';
import { Role } from '../auth/role/role.enum';
import { AUTH_ERRORS } from '../auth/auth.constants';

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

  async findOne(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
  ): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: commentWhereUniqueInput,
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

  async update(
    user: User,
    id: number,
    data: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne({ id });
    if (user.role === Role.Admin || comment.commenterId === user.id) {
      return this.prisma.comment.update({
        where: { id },
        data,
      });
    } else {
      throw new UnauthorizedException(AUTH_ERRORS.CANT_EDIT);
    }
  }

  async remove(role: Role, id: number, userId: number): Promise<void> {
    const comment = await this.findOne({ id });
    if (role === Role.Admin || comment.commenterId === userId) {
      await this.prisma.comment.delete({
        where: { id },
      });
    } else {
      throw new UnauthorizedException(AUTH_ERRORS.CANT_DELETE);
    }
  }
}
