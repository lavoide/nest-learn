import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma.service';
import { JWT_CONSTANTS } from './jwt/jwt.constants';
import { JWT_PUBLIC } from './auth.constants';
import { LocalStrategy } from './local/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_CONSTANTS.SECRET,
      signOptions: { expiresIn: JWT_PUBLIC.EXPIRE_TIME },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    FilesService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
