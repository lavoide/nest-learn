import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { BookCategoriesModule } from './book-categories/book-categories.module';
@Module({
  imports: [UsersModule, BooksModule, CategoriesModule, BookCategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
