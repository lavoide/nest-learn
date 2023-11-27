import { Book } from '@prisma/client';

export class User {
  id: number;
  name: string;
  email: string;
  books: Book[];
}
