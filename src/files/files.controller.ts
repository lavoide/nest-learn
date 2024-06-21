import {
  Controller,
  Get,
  Res,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('static-file')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  getFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /image\/(jpg|jpeg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.create(file);
  }

  @Post('upload-aws')
  @UseInterceptors(FileInterceptor('file'))
  uploadPublicFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /image\/(jpg|jpeg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.createPublic(file);
  }

  @Get('get-all-files')
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne({ id: Number(id) });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove({ id: Number(id) });
  }

  @Delete('/public/:id')
  removePublic(@Param('id') id: string) {
    return this.filesService.removePublic({ id: Number(id) });
  }
}
