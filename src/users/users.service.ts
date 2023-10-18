import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private lastUserId = 0;
  private users: User[] = [];

  create(user: CreateUserDto) {
    const newUser = {
      id: ++this.lastUserId,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  update(id: number, user: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex > -1) {
      this.users[userIndex] = user;
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex > -1) {
      this.users.splice(userIndex, 1);
      return 'User successfully deleted';
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
