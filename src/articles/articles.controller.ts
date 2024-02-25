import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiTags } from '@nestjs/swagger';
import { Article } from '@prisma/client';

@Controller('articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articlesService.update(Number(id), updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Article> {
    return this.articlesService.remove(Number(id));
  }
}
