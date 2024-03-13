import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import RoleGuard from 'src/auth/role/role.guard';
import { Role } from 'src/auth/role/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt/jwtAuth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne({ id: Number(id) });
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

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove({ id: Number(id) });
  }
}
