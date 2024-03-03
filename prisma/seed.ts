// seed.ts
import { PrismaClient } from '@prisma/client';
import { CreateArticleDto } from 'src/articles/dto/create-article.dto';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete all records from BookCategory, Book, Category, and User
  await prisma.bookCategory.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
}

async function seedDatabase() {
  // Seed data for Users
  const users: CreateUserDto[] = [
    { email: 'john@example.com', name: 'John Doe', password: 'test' },
    { email: 'jane@example.com', name: 'Jane Doe', password: 'test' },
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

  const articles: CreateArticleDto[] = [
    {
      title: 'Science',
      content: 'text',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: createdUsers[0].id,
    },
    {
      title: 'Science1',
      content: 'text1',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: createdUsers[0].id,
    },
    {
      title: 'Science2',
      content: 'text2',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: createdUsers[0].id,
    },
    {
      title: 'Science3',
      content: 'text3',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: createdUsers[0].id,
    },
    {
      title: 'Science4',
      content: 'text4',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: createdUsers[0].id,
    },
    {
      title: 'Science5',
      content: 'text5',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: createdUsers[0].id,
    },
    {
      title: 'Science6',
      content: 'text6',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: createdUsers[0].id,
    },
    {
      title: 'Science7',
      content: 'text7',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: createdUsers[0].id,
    },
    {
      title: 'Science',
      content: 'text',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: createdUsers[0].id,
    },
  ];

  await prisma.article.createMany({ data: articles });

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
