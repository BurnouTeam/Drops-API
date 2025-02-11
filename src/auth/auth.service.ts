import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/users/users.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(
      loginUserDto.email,
      loginUserDto.organizationId,
    );

    if (
      !user ||
      !(await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    await this.updateRefreshToken(
      user.id,
      user.organizationId,
      tokens.refreshToken,
    );

    this.logger.log(`User ${user.email} logged in`);
    return {
      message: 'Login successful',
      user: user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
      createUserDto.organizationId,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const input = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      profilePhoto: createUserDto.profilePhoto,
      role: {
        connect: { id: createUserDto.roleId ? createUserDto.roleId : null },
      },
      organization: {
        connect: { id: createUserDto.organizationId },
      },
    };

    const user = await this.usersService.create(input);

    const tokens = await this.generateTokens(user);

    await this.updateRefreshToken(
      user.id,
      user.organizationId,
      tokens.refreshToken,
    );

    this.logger.log(`User ${user.name} created`);
    return {
      message: 'User created!',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: user,
    };
  }

  private async generateTokens(user: User): Promise<any> {
    const payload = {
      sub: user.id,
      email: user.email,
      orgId: user.organizationId,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(
    userId: number,
    organizationId: number,
    refreshToken: string,
  ) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
      organizationId: organizationId,
    });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne({ id: userId });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied, no data');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Access Denied, invalid token');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(
      userId,
      user.organizationId,
      tokens.refreshToken,
    );
    this.logger.log(`Tokens refreshed for the User ${user.name}`);
    return tokens;
  }

  async validateRefreshToken(refreshToken: string): Promise<any> {
    const secret_key = this.configService.get('JWT_REFRESH_SECRET');
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: secret_key,
      });
      return payload;
    } catch (error) {
      throw new HttpException(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
