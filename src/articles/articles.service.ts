import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ARTICLE_ERRORS, PAGE_SIZE_ARTICLE } from './articles.contsants';
import { ArticleDto } from './dto/article.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateArticleDto): Promise<Article> {
    const article = data;
    article['createdAt'] = new Date();
    article['updatedAt'] = new Date();
    return this.prisma.article.create({
      data: article,
    });
  }

  async findAll(): Promise<Article[]> {
    return this.prisma.article.findMany();
  }

  async findOne(id: number): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
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
    sortOrder: string,
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
      if (sortOrder !== 'asc' && sortOrder !== 'desc') {
        throw new HttpException(
          ARTICLE_ERRORS.WRONG_ORDER,
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

  async update(id: number, data: UpdateArticleDto): Promise<Article> {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });
    if (!article) {
      throw new HttpException(ARTICLE_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const updatedArticle = data;
    updatedArticle['updatedAt'] = new Date();
    return this.prisma.article.update({
      where: { id },
      data: updatedArticle,
    });
  }

  async remove(id: number): Promise<Article> {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });
    if (!article) {
      throw new HttpException(ARTICLE_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
