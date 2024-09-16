import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import RoleGuard from '../auth/role/role.guard';
import { Role } from '../auth/role/role.enum';
import { JwtAuthGuard } from '../auth/jwt/jwtAuth.guard';
import RequestWithUser from '../auth/requestWithUser.interface';
import { FILE_CONSTANTS } from '../files/files.contsants';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne({ id: Number(id) });
  }

  @Patch('/add-file-private')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  addFilePrivate(
    @Request() request: RequestWithUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE_CONSTANTS.MAX_SIZE }),
          new FileTypeValidator({ fileType: FILE_CONSTANTS.FILE_TYPE }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    return this.usersService.addFilePrivate(Number(request.user.id), file);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update({
      where: { id: Number(id) },
      data: updateUserDto,
    });
  }

  @Patch('/add-avatar/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  addAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE_CONSTANTS.MAX_SIZE }),
          new FileTypeValidator({ fileType: FILE_CONSTANTS.FILE_TYPE }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.addAvatar({
      where: { id: Number(id) },
      data: file,
    });
  }

  @Patch('/add-avatar-public/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  addAvatarPublic(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE_CONSTANTS.MAX_SIZE }),
          new FileTypeValidator({ fileType: FILE_CONSTANTS.FILE_TYPE }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.addAvatarPublic({
      where: { id: Number(id) },
      data: file,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove({ id: Number(id) });
  }

  @Post('/remove-avatar-public/:id')
  removePublicAvatar(@Param('id') id: string): Promise<User> {
    return this.usersService.removeAvatarPublic({ id: Number(id) });
  }
}
