import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { FilesService } from 'src/files/files.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, FilesService],
})
export class UsersModule {}
