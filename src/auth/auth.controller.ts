import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiBody({ schema: { properties: { username: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  async register(@Body() body: { username: string; password: string }) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    return this.userService.create(body.username, hashedPassword);
  }

  @Post('login')
  @ApiBody({ schema: { properties: { username: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Login success, returns access and refresh token.' })
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generate refresh token dengan expired berbeda (30 hari)
    const refreshToken = this.jwtService.sign(
      { sub: user.id, username: user.username },
      { secret: 'refresh_secret', expiresIn: '30d' } // 30 hari
    );
    await this.userService.setRefreshToken(user.id, refreshToken);
    return {
      ...(await this.authService.login(user)),
      refresh_token: refreshToken,
      refresh_token_expires_in: 30 * 24 * 60 * 60, // 30 hari dalam detik
    };
  }

  @Post('refresh')
  @ApiBody({ schema: { properties: { refresh_token: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Returns new access token.' })
  async refresh(@Body() body: { refresh_token: string }) {
    try {
      const payload = this.jwtService.verify(body.refresh_token, { secret: 'refresh_secret' });
      const user = await this.userService.findByRefreshToken(body.refresh_token);
      if (!user) throw new UnauthorizedException('Invalid refresh token');
      // Generate access token baru
      return this.authService.login(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
