import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { BookCategoriesModule } from './book-categories/book-categories.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
@Module({
  imports: [
    UsersModule,
    BooksModule,
    CategoriesModule,
    BookCategoriesModule,
    AuthModule,
    ArticlesModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
