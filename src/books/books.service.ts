import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookDto): Promise<Book> {
    return this.prisma.book.create({
      data,
    });
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
    data: UpdateBookDto;
  }): Promise<Book> {
    const { where, data } = params;
    const book = await this.prisma.book.findUnique({
      where,
    });
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.book.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.BookWhereUniqueInput): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where,
    });
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.book.delete({
      where,
    });
  }
}
