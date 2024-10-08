import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
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
      const lowerCasedEmail = email.toLowerCase();
      const user = await this.usersService.findOne({ email: lowerCasedEmail });
      await this.verifyPassword(password, user.password);
      const payload = { id: user.id, name: user.name, email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);
      return `Authentication=${access_token}; HttpOnly; Path=/; Max-Age=${JWT_PUBLIC.EXPIRE_TIME}; Secure; SameSite=None`;
    } catch (error) {
      throw new HttpException(AUTH_ERRORS.WRONG_CREDS, HttpStatus.BAD_REQUEST);
    }
  }

  public async refreshLogin(email: string) {
    const lowerCasedEmail = email.toLowerCase();
    const user = await this.usersService.findOne({ email: lowerCasedEmail });
    const payload = { id: user.id, name: user.name, email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: JWT_CONSTANTS.REFRESH_SECRET,
      expiresIn: JWT_PUBLIC.REFRESH_EXPIRE_TIME,
    });
    const cookie = `Refresh=${access_token}; HttpOnly; Path=/; Max-Age=${JWT_PUBLIC.REFRESH_EXPIRE_TIME}; Secure; SameSite=None`;
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
    registrationData.email = registrationData.email.toLowerCase();
    const isUserExist = await this.usersService.findOne({
      email: registrationData.email,
    });
    if (isUserExist) {
      throw new HttpException(
        AUTH_ERRORS.SOMETHING_WRONG,
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdUser = await this.usersService.create({
      ...registrationData,
      password: hashedPassword,
    });
    createdUser.password = undefined;
    return createdUser;
  }

  public async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update({
      where: { email },
      data: { refreshToken: currentHashedRefreshToken },
    });
  }

  public async removeRefreshToken(email: string) {
    return this.usersService.update({
      where: { email },
      data: {
        refreshToken: null,
      },
    });
  }

  public getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
