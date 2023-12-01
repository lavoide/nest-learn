import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookCategoriesService } from './book-categories.service';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { BookCategory } from '@prisma/client';

@Controller('book-categories')
@ApiTags('BookCategories')
export class BookCategoriesController {
  constructor(private readonly bookCategoriesService: BookCategoriesService) {}

  @Post()
  create(@Body() createBookCategoryDto: CreateBookCategoryDto) {
    return this.bookCategoriesService.addBookToCategory(createBookCategoryDto);
  }

  @Get()
  findAll(): Promise<BookCategory[]> {
    return this.bookCategoriesService.findAll({});
  }

  @Get('/book/:id')
  getCategoriesByBook(@Param('id') id: string): Promise<BookCategory[]> {
    return this.bookCategoriesService.findAll({
      where: { bookId: Number(id) },
    });
  }

  @Get('/category/:id')
  getBooksByCategory(@Param('id') id: string): Promise<BookCategory[]> {
    return this.bookCategoriesService.findAll({
      where: { categoryId: Number(id) },
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<BookCategory> {
    return this.bookCategoriesService.remove({ id: Number(id) });
  }
}
