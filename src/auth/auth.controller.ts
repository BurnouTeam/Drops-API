import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const result = await this.authService.login(loginUserDto);
    res.cookie('drop', result.refreshToken, {
      httpOnly: true,
      // TODO: Only send if it is HTTPS we should use this after
      // secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).send({
      message: result.message,
      accessToken: result.accessToken,
    });
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const tokens = await this.authService.signUp(createUserDto);
    res.cookie('drop', tokens.refreshToken, {
      httpOnly: true,
      // TODO: Only send if it is HTTPS we should use this after
      // secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.status(201).send({
      message:tokens.message,
      accessToken:tokens.accessToken,
    })
  }

  @Post('refresh')
  async refreshToken(@Req() req, @Res() res: Response) {
    const refreshToken =
      req.cookies['drop'] || req.headers['authorization']?.split(' ')[1];

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Refresh token is missing or invalid',
      });
    }

    try {

      const { userId } = await this.authService.validateRefreshToken(refreshToken);

      const tokens = await this.authService.refreshTokens(userId, refreshToken)


      res.cookie('drop', tokens.refreshToken, {
        httpOnly: true,
      // TODO: Only send if it is HTTPS we should use this after
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(HttpStatus.OK).json({
        accessToken: tokens.refreshToken,
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid or expired refresh token',
      });
    }
  }
}
