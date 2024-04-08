import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Article, Prisma, User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleDto } from './dto/article.dto';
import {
  ARTICLE_ERRORS,
  OrderDirectionConstants,
  PAGE_SIZE_ARTICLE,
} from './articles.contsants';

import { AUTH_ERRORS } from '../auth/auth.constants';
import { Role } from '../auth/role/role.enum';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateArticleDto): Promise<Article> {
    return this.prisma.article.create({
      data,
    });
  }

  async findAll(): Promise<Article[]> {
    return this.prisma.article.findMany();
  }

  async findOne(
    articleWhereUniqueInput: Prisma.ArticleWhereUniqueInput,
  ): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: articleWhereUniqueInput,
    });
    if (article) {
      return article;
    }
    throw new HttpException(ARTICLE_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async getArticlesPaginated(
    authorId: number,
    page: number,
    sortBy: string,
    sortOrder: OrderDirectionConstants,
    filterBy: string,
    filterContains: string,
  ): Promise<Article[]> {
    if (!page || page - 1 < 1) {
      page = 1;
    }
    const articleDtoInstance = plainToInstance(ArticleDto, {});

    const where: any = { authorId };
    if (filterBy) {
      const isValidFilterProperty =
        Object.keys(articleDtoInstance).includes(filterBy);
      if (!isValidFilterProperty) {
        throw new HttpException(
          ARTICLE_ERRORS.WRONG_PARAM,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      where[`${filterBy}`] = { contains: filterContains };
    }
    const orderBy: any = {};
    if (sortBy) {
      const isValidSortProperty =
        Object.keys(articleDtoInstance).includes(sortBy);
      if (!isValidSortProperty) {
        throw new HttpException(
          ARTICLE_ERRORS.WRONG_PARAM,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      orderBy[`${sortBy}`] = sortOrder;
    }

    return this.prisma.article.findMany({
      where: where,
      skip: (page - 1) * PAGE_SIZE_ARTICLE,
      take: PAGE_SIZE_ARTICLE,
      orderBy: orderBy,
    } as any);
  }

  async update(
    user: User,
    id: number,
    data: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.findOne({ id });
    if (user.role === Role.Admin || article.authorId === user.id) {
      return this.prisma.article.update({
        where: { id },
        data,
      });
    } else {
      throw new UnauthorizedException(AUTH_ERRORS.CANT_EDIT);
    }
  }

  async remove(role: Role, id: number, userId: number): Promise<void> {
    const article = await this.findOne({ id });
    if (role === Role.Admin || article.authorId === userId) {
      await this.prisma.article.delete({
        where: { id },
      });
    } else {
      throw new UnauthorizedException(AUTH_ERRORS.CANT_DELETE);
    }
  }
}
