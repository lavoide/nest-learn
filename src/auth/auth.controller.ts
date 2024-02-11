import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local/localAuth.guard';
import { JwtAuthGuard } from './jwt/jwtAuth.guard';
import RequestWithUser from './requestWithUser.interface';
import { Response } from 'express';

@Controller('auth')
@ApiBearerAuth('JWT-auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Body() signInDto: AuthDto, @Res() response: Response) {
    const accessCookie = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    const { refreshCookie, token } = await this.authService.refreshLogin(
      signInDto.email,
    );
    await this.authService.setCurrentRefreshToken(token, signInDto.email);
    response.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    return response.sendStatus(200);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logOut(@Request() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
}
