// book-categories.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookCategory, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';

@Injectable()
export class BookCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookCategoryDto): Promise<BookCategory> {
    try {
      const bookCategory = this.prisma.bookCategory.create({
        data,
      });
      return bookCategory;
    } catch (err) {
      throw new HttpException('Create Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BookCategoryWhereUniqueInput;
    where?: Prisma.BookCategoryWhereInput;
    orderBy?: Prisma.BookCategoryOrderByWithRelationInput;
  }): Promise<BookCategory[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.bookCategory.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    bookCategoryWhereUniqueInput: Prisma.BookCategoryWhereUniqueInput,
  ): Promise<BookCategory | null> {
    const bookCategory = await this.prisma.bookCategory.findUnique({
      where: bookCategoryWhereUniqueInput,
    });
    if (bookCategory) {
      return bookCategory;
    }
    throw new HttpException('BookCategory not found', HttpStatus.NOT_FOUND);
  }

  async update(params: {
    where: Prisma.BookCategoryWhereUniqueInput;
    data: UpdateBookCategoryDto;
  }): Promise<BookCategory> {
    const { where, data } = params;
    return this.prisma.bookCategory.update({
      data,
      where,
    });
  }

  async remove(
    where: Prisma.BookCategoryWhereUniqueInput,
  ): Promise<BookCategory> {
    return this.prisma.bookCategory.delete({
      where,
    });
  }
}
