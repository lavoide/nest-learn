import { Module } from '@nestjs/common';
import { BookCategoriesService } from './book-categories.service';
import { BookCategoriesController } from './book-categories.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BookCategoriesController],
  providers: [BookCategoriesService, PrismaService],
})
export class BookCategoriesModule {}
