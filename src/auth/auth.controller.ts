import { Controller, Post, Body, UnauthorizedException, ConflictException, BadRequestException, UseGuards, Request, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile fetched successfully.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Profile fetched successfully' },
            username: { type: 'string', example: 'userbaru' },
          },
        },
      },
    },
  })
  async getProfile(@Request() req) {
    // Ambil username dari JWT payload
    const username = req.user?.username;
    if (!username) {
      return { message: 'Invalid JWT payload: username not found', username: null };
    }
    return { message: 'Profile fetched successfully', username };
  }
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiBody({ schema: { properties: { username: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User registered successfully' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Bad Request' },
            message: { type: 'string', example: 'Username and password are required' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Username already exists.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Conflict' },
            message: { type: 'string', example: 'Username already exists' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Internal Server Error' },
            message: { type: 'string', example: 'Internal server error' },
          },
        },
      },
    },
  })
  async register(@Body() body: { username: string; password: string }) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await this.userService.create(body.username, hashedPassword);
    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  @Post('login')
  @ApiBody({ schema: { properties: { username: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({
    status: 201,
    description: 'Login success, returns access and refresh token.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login success' },
            access_token: { type: 'string', example: 'jwt-access-token' },
            refresh_token: { type: 'string', example: 'jwt-refresh-token' },
            refresh_token_expires_in: { type: 'number', example: 2592000 },
            expires_in: { type: 'number', example: 1200 },
            token_type: { type: 'string', example: 'Bearer' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generate refresh token dengan expired berbeda (30 hari)
    const refreshToken = this.jwtService.sign(
      { sub: user.id, username: user.username },
      { secret: this.configService.get('REFRESH_SECRET'), expiresIn: '30d' }
    );
    await this.userService.setRefreshToken(user.id, refreshToken);
    const loginResult = await this.authService.login(user);
    return {
      message: 'Login success',
      ...loginResult,
      refresh_token: refreshToken,
      refresh_token_expires_in: 30 * 24 * 60 * 60, // 30 hari dalam detik
    };
  }

  @Post('refresh')
  @ApiBody({ schema: { properties: { refresh_token: { type: 'string' } } } })
  @ApiResponse({
    status: 201,
    description: 'Returns new access token.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Token refreshed successfully' },
            access_token: { type: 'string', example: 'jwt-access-token' },
            expires_in: { type: 'number', example: 1200 },
            token_type: { type: 'string', example: 'Bearer' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async refresh(@Body() body: { refresh_token: string }) {
    try {
      const payload = this.jwtService.verify(body.refresh_token, { secret: this.configService.get('REFRESH_SECRET') });
      const user = await this.userService.findByRefreshToken(body.refresh_token);
      if (!user || !user.refreshToken || user.refreshToken !== body.refresh_token) {
        throw new UnauthorizedException('Refresh token invalid or already logged out');
      }
      // Generate access token baru
      const loginResult = await this.authService.login(user);
      return {
        message: 'Token refreshed successfully',
        ...loginResult,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user (invalidate refresh token)' })
  @ApiResponse({
    status: 200,
    description: 'Logout success',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Logout success' },
          },
        },
      },
    },
  })
  async logout(@Request() req) {
    const username = req.user?.username;
    if (!username) {
      return { message: 'Invalid JWT payload: username not found' };
    }
    const user = await this.userService.findByUsername(username);
    if (user) {
      await this.userService.setRefreshToken(user.id, '');
    }
    return { message: 'Logout success' };
  }
}
