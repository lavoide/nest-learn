// book-categories.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookCategoriesService } from './book-categories.service';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { BookCategory } from '@prisma/client';

@Controller('book-categories')
@ApiTags('BookCategories')
export class BookCategoriesController {
  constructor(private readonly bookCategoriesService: BookCategoriesService) {}

  @Post()
  create(@Body() createBookCategoryDto: CreateBookCategoryDto) {
    return this.bookCategoriesService.create(createBookCategoryDto);
  }

  @Get()
  findAll(): Promise<BookCategory[]> {
    return this.bookCategoriesService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookCategory> {
    return this.bookCategoriesService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookCategoryDto: UpdateBookCategoryDto,
  ): Promise<BookCategory> {
    return this.bookCategoriesService.update({
      where: { id: Number(id) },
      data: updateBookCategoryDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<BookCategory> {
    return this.bookCategoriesService.remove({ id: Number(id) });
  }
}
