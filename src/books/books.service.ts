import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BookCreateInput): Promise<Book> {
    try {
      const book = this.prisma.book.create({
        data,
      });
      return book;
    } catch (err) {
      throw new HttpException('Create Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BookWhereUniqueInput;
    where?: Prisma.BookWhereInput;
    orderBy?: Prisma.BookOrderByWithRelationInput;
  }): Promise<Book[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.book.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    bookWhereUniqueInput: Prisma.BookWhereUniqueInput,
  ): Promise<Book | null> {
    const book = await this.prisma.book.findUnique({
      where: bookWhereUniqueInput,
    });
    if (book) {
      return book;
    }
    throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
  }

  async update(params: {
    where: Prisma.BookWhereUniqueInput;
    data: Prisma.BookUpdateInput;
  }): Promise<Book> {
    const { where, data } = params;
    return this.prisma.book.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.BookWhereUniqueInput): Promise<Book> {
    return this.prisma.book.delete({
      where,
    });
  }
}
