import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_ERRORS } from './users.contsants';
import { FilesService } from '../files/files.service';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
    private tasksService: TasksService
  ) { }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (user) {
      return user;
    }
    throw new HttpException(USER_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }): Promise<User> {
    const { where, data } = params;
    await this.findOne(where);
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async manageNotifications(where: Prisma.UserWhereUniqueInput, doNotify: boolean){
    const updatedUser = await this.update({
      where,
      data: {
        doNotify 
      }
    })
    if(doNotify) {
      this.tasksService.addCronJob(`Notify_${updatedUser.email}`, '30');
    } else {
      this.tasksService.deleteCron(`Notify_${updatedUser.email}`);
    }
  }

  async addAvatar(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Express.Multer.File;
  }) {
    const { where, data } = params;
    const file = await this.filesService.create(data);
    const user = await this.prisma.user.findUnique({
      where,
    });
    if (user) {
      return await this.prisma.user.update({
        data: { avatarId: file.id },
        where,
      });
    }
    throw new HttpException(USER_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async addAvatarPublic(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Express.Multer.File;
  }) {
    const { where, data } = params;
    const file = await this.filesService.createPublic(data);
    const user = await this.findOne(where);
    if (user.publicFileId) {
      await this.filesService.removePublic({ id: user.publicFileId });
    }
    return await this.prisma.user.update({
      data: { publicFileId: file.id },
      where,
    });
  }

  async addFilePrivate(ownerId: number, data: Express.Multer.File) {
    await this.findOne({ id: ownerId });
    await this.filesService.createPrivate(data, ownerId);
  }

  async removeAvatarPublic(where: Prisma.UserWhereUniqueInput) {
    const user = await this.findOne(where);
    if (user.publicFileId) {
      await this.filesService.removePublic({ id: user.publicFileId });
      return await this.prisma.user.update({
        data: { publicFileId: null },
        where,
      });
    }
  }

  async removeAvatar(where: Prisma.UserWhereUniqueInput) {
    const user = await this.findOne(where);
    if (user.avatarId) {
      await this.filesService.remove({ id: user.avatarId });
      return await this.prisma.user.update({
        data: { avatarId: null },
        where,
      });
    }
  }

  async remove(where: Prisma.UserWhereUniqueInput) {
    await this.findOne(where);
    await this.prisma.user.delete({
      where,
    });
  }
}
