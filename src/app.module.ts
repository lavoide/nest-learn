import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { BookCategoriesModule } from './book-categories/book-categories.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { FilesModule } from './files/files.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    BooksModule,
    CategoriesModule,
    BookCategoriesModule,
    AuthModule,
    ArticlesModule,
    CommentsModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
