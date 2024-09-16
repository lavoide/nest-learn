import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Article } from '@prisma/client';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryDto } from './dto/article-query.dto';
import RequestWithUser from '../auth/requestWithUser.interface';
import { Role } from '../auth/role/role.enum';
import { JwtAuthGuard } from '../auth/jwt/jwtAuth.guard';

@Controller('articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Request() request: RequestWithUser,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    const data = createArticleDto;
    data.authorId = request.user?.id;
    return this.articlesService.create(data);
  }

  @Get()
  findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne({ id: Number(id) });
  }

  @Get('/by-user-id/:userId')
  findByUserId(
    @Param('userId') authorId: string,
    @Query() query: ArticleQueryDto,
  ): Promise<Article[]> {
    return this.articlesService.getArticlesPaginated(
      Number(authorId),
      Number(query?.page),
      query?.sortBy,
      query?.sortOrder,
      query?.filterBy,
      query?.filterContains,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() request: RequestWithUser,
  ): Promise<Article> {
    return this.articlesService.update(
      request.user,
      Number(id),
      updateArticleDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Request() request: RequestWithUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.articlesService.remove(
      request.user.role as Role,
      Number(id),
      Number(request.user.id),
    );
  }
}
