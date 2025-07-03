import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
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
    // Generate refresh token
    const refreshToken = this.jwtService.sign(
      { sub: user.id, username: user.username },
      { secret: 'refresh_secret', expiresIn: '10m' }
    );
    await this.userService.setRefreshToken(user.id, refreshToken);
    return {
      ...(await this.authService.login(user)),
      refresh_token: refreshToken,
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
      return this.authService.login(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
