// seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateArticleDto } from 'src/articles/dto/create-article.dto';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from '../src/auth/role/role.enum';

const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete all records from BookCategory, Book, Category, and User
  await prisma.bookCategory.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.user.deleteMany({});
}

async function seedDatabase() {
  // Seed data for Users
  const users: CreateUserDto[] = [
    {
      email: 'john@example.com',
      name: 'John Doe',
      password: await bcrypt.hash('test', 10),
    },
    {
      email: 'jane@example.com',
      name: 'Jane Doe',
      password: await bcrypt.hash('test', 10),
    },
    {
      email: 'admin@admin.com',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      role: Role.Admin,
    },
  ];

  // Seed data for Categories
  const categories: CreateCategoryDto[] = [
    { name: 'Science Fiction' },
    { name: 'Fantasy' },
    { name: 'Mystery' },
  ];

  // Insert seed data into the database
  await prisma.user.createMany({ data: users });
  await prisma.category.createMany({
    data: categories,
  });
  const createdUsers = await prisma.user.findMany({});

  // Seed data for Books
  const books: CreateBookDto[] = [
    {
      title: 'The Martian',
      content: 'Survival on Mars',
      published: true,
      ownerId: createdUsers[0].id,
    },
    {
      title: 'Harry Potter',
      content: 'Wizardry adventures',
      published: true,
    },
  ];

  await prisma.book.createMany({ data: books });

  const createdCategories = await prisma.category.findMany({});
  const createdBooks = await prisma.book.findMany({});

  await prisma.bookCategory.createMany({
    data: [
      {
        bookId: createdBooks[0].id,
        categoryId: createdCategories[0].id,
      },
      {
        bookId: createdBooks[1].id,
        categoryId: createdCategories[0].id,
      },
      {
        bookId: createdBooks[0].id,
        categoryId: createdCategories[1].id,
      },
      {
        bookId: createdBooks[1].id,
        categoryId: createdCategories[1].id,
      },
    ],
  });

  const articles: CreateArticleDto[] = [];
  const numObjects = 8;
  for (let i = 0; i < numObjects; i++) {
    articles.push({
      title: `Science${i === 0 ? '' : i}`,
      content: `text${i === 0 ? '' : i}`,
      authorId: createdUsers[2].id,
    });
  }

  await prisma.article.createMany({ data: articles });
  const createdArticles = await prisma.article.findMany({});

  const comments: CreateCommentDto[] = [];
  for (let i = 0; i < numObjects; i++) {
    comments.push({
      text: `Comment${i === 0 ? '' : i}`,
      commenterId: createdUsers[0].id,
      articleId: createdArticles[0].id,
    });
  }

  await prisma.comment.createMany({ data: comments });

  console.log('Seed data inserted successfully');
}

async function main() {
  try {
    // Clear the database
    await clearDatabase();

    // Seed the database
    await seedDatabase();

    console.log('Database cleared and seeded successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect from the Prisma client
    await prisma.$disconnect();
  }
}

main();
