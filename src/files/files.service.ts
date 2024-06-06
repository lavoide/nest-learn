import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { FILE_ERRORS } from './files.contsants';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}
  async create(file: Express.Multer.File) {
    const { originalname, mimetype, size, buffer } = file;
    const newFile = await this.prisma.file.create({
      data: {
        filename: originalname,
        mimetype: mimetype,
        size: size,
        data: buffer,
      },
    });
    return newFile;
  }

  async findAll() {
    return await this.prisma.file.findMany();
  }

  async findOne(fileWhereUniqueInput: Prisma.FileWhereUniqueInput) {
    const file = await this.prisma.file.findUnique({
      where: fileWhereUniqueInput,
    });
    if (file) {
      return file;
    }
    throw new HttpException(FILE_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async remove(where: Prisma.FileWhereUniqueInput) {
    await this.findOne(where);
    await this.prisma.file.delete({
      where,
    });
  }
}
