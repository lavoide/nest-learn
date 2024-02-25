import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ARTICLE_ERRORS } from './articles.contsants';

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

  async findOne(id: number): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });
    if (article) {
      return article;
    }
    throw new HttpException(ARTICLE_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async update(id: number, data: UpdateArticleDto): Promise<Article> {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });
    if (!article) {
      throw new HttpException(ARTICLE_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.prisma.article.update({
      where: { id },
      data,
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
