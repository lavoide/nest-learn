import { Injectable } from '@nestjs/common';
import { BookCategory, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';

@Injectable()
export class BookCategoriesService {
  constructor(private prisma: PrismaService) {}

  async addBookToCategory(data: CreateBookCategoryDto): Promise<BookCategory> {
    await this.prisma.book.findFirstOrThrow({
      where: { id: data.bookId },
    });
    await this.prisma.category.findFirstOrThrow({
      where: { id: data.categoryId },
    });
    return this.prisma.bookCategory.create({
      data,
    });
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

  async remove(
    where: Prisma.BookCategoryWhereUniqueInput,
  ): Promise<BookCategory> {
    return this.prisma.bookCategory.delete({
      where,
    });
  }
}
