import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookDto): Promise<Book> {
    // If no user id is provided the book is created without an owner
    if (!data.ownerId) {
      return this.prisma.book.create({
        data,
      });
    }
    const user = await this.prisma.user.findUnique({
      where: { id: data.ownerId },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const { ownerId, ...bookData } = data;
    return this.prisma.book.create({
      data: {
        ...bookData,
        owner: { connect: { id: ownerId } },
      },
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

  async getBooksByUserId(userId: number) {
    return this.findAll({ where: { ownerId: userId } });
  }

  async getBooksByCategoryId(categoryId: number) {
    const result = await this.prisma.bookCategory.findMany({
      where: { categoryId },
      include: { book: true },
    });
    return result.map((item) => item.book);
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
    // If no user id is provided the book is updated without the owner
    if (!data.ownerId) {
      return this.prisma.book.update({
        data,
        where,
      });
    }
    const user = await this.prisma.user.findUnique({
      where: { id: data.ownerId },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const { ownerId, ...bookData } = data;
    return this.prisma.book.update({
      data: {
        ...bookData,
        owner: { connect: { id: ownerId } },
      },
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
