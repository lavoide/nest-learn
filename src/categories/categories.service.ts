import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CATEGORY_ERRORS } from './categories.contsants';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }): Promise<Category[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.category.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: categoryWhereUniqueInput,
    });
    if (category) {
      return category;
    }
    throw new HttpException(CATEGORY_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async getCategoriesByBookId(bookId: number) {
    const result = await this.prisma.bookCategory.findMany({
      where: { bookId },
      include: { category: true },
    });

    return result.map((item) => item.category);
  }

  async update(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: CreateCategoryDto;
  }): Promise<Category> {
    const { where, data } = params;
    const category = await this.prisma.category.findUnique({
      where,
    });
    if (!category) {
      throw new HttpException(CATEGORY_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.prisma.category.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where,
    });
    if (!category) {
      throw new HttpException(CATEGORY_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.prisma.category.delete({
      where,
    });
  }
}
