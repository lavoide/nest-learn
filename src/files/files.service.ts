import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { PrismaService } from 'src/prisma.service';
import { FILE_ERRORS } from './files.contsants';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  s3 = new S3({
    region: this.configService.get('AWS_REGION'),
    accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  });

  async createPublic(file: Express.Multer.File) {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: file.buffer,
        Key: `${uuid()}-avatar.${file.originalname.split('.')[1]}`,
      })
      .promise();

    const newFile = await this.prisma.publicFile.create({
      data: {
        key: uploadResult.Key,
        url: uploadResult.Location,
      },
    });
    return newFile;
  }

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

  async findOnePublic(fileWhereUniqueInput: Prisma.PublicFileWhereUniqueInput) {
    const file = await this.prisma.publicFile.findUnique({
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

  async removePublic(where: Prisma.PublicFileWhereUniqueInput) {
    const publicFile = await this.findOnePublic(where);
    console.log(where, publicFile);

    const params = {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: publicFile.key,
    };
    try {
      await this.s3.headObject(params).promise();
      console.log('File Found in S3');
      try {
        await this.s3.deleteObject(params).promise();
      } catch (err) {
        throw new HttpException(
          FILE_ERRORS.ERROR_DELETING,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(FILE_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.prisma.publicFile.delete({
      where,
    });
  }
}
