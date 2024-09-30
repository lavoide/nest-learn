import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { FilesService } from '../files/files.service';
import { MailService } from '../mail/mail.service';
import { TasksService } from '../tasks/tasks.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, FilesService, ConfigService, MailService, TasksService],
})
export class UsersModule { }
