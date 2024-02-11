import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { AUTH_ERRORS, JWT_PUBLIC } from './auth.constants';
import { JWT_CONSTANTS } from './jwt/jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async signIn(email: string, password: string) {
    try {
      const user = await this.usersService.findOne({ email });
      await this.verifyPassword(password, user.password);
      const payload = { id: user.id, email };
      const access_token = await this.jwtService.signAsync(payload);
      // You can return the access token directly, but here I am using cookies
      return `Authentication=${access_token}; HttpOnly; Path=/; Max-Age=${JWT_PUBLIC.EXPIRE_TIME}`;
    } catch (error) {
      throw new HttpException(AUTH_ERRORS.WRONG_CREDS, HttpStatus.BAD_REQUEST);
    }
  }

  public async refreshLogin(email: string) {
    const user = await this.usersService.findOne({ email });
    const payload = { id: user.id, email };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: JWT_CONSTANTS.REFRESH_SECRET,
      expiresIn: JWT_PUBLIC.REFRESH_EXPIRE_TIME,
    });
    const cookie = `Refresh=${access_token}; HttpOnly; Path=/; Max-Age=${JWT_PUBLIC.REFRESH_EXPIRE_TIME}`;
    return {
      refreshCookie: cookie,
      token: access_token,
    };
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      // Same email error
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          AUTH_ERRORS.SOMETHING_WRONG,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        AUTH_ERRORS.SOMETHING_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update({
      where: { email },
      data: { refreshToken: currentHashedRefreshToken },
    });
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
