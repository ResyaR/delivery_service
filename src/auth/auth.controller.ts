import { Controller, Post, Body, UnauthorizedException, ConflictException, BadRequestException, UseGuards, Request, Get, Inject, InternalServerErrorException, Query, Res, Req } from '@nestjs/common';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiTags, ApiBody, ApiResponse, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LogoutSuccessDto, LogoutErrorDto } from './dto/logout.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('token')
  @ApiOperation({ summary: 'Login using access token' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated with token',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                fullName: { type: 'string' },
                phone: { type: 'string' },
              }
            },
            message: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token'
  })
  async loginWithToken(@Request() req) {
    // Token sudah divalidasi oleh JwtAuthGuard
    const user = req.user;
    return {
      message: 'Successfully authenticated',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone
      }
    };
  }

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
            email: { type: 'string', example: 'user@email.com' },
            fullName: { type: 'string', example: 'Budi Santoso' },
            phone: { type: 'string', example: '+628123456789' },
            avatar: { type: 'string', example: 'https://cdn.example.com/avatar.jpg' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Unauthorized' },
            error: { type: 'string', example: 'Unauthorized' },
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
  async getProfile(@Request() req) {
    const user = req.user;
    if (!user?.email) {
      return { message: 'Invalid JWT payload: email not found', email: null };
    }
    return {
      message: 'Profile fetched successfully',
      email: user.email,
      fullName: user.fullName || null,
      phone: user.phone || null,
      avatar: user.avatar || null,
    };
  }
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}



  @Post('register')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password', 'username'],
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' },
        username: { 
          type: 'string',
          example: 'johndoe123',
          pattern: '^[a-zA-Z0-9_]+$',
          minLength: 4,
          description: 'Username must be unique and contain only letters, numbers, and underscores'
        },
        password: { 
          type: 'string',
          format: 'password',
          example: 'StrongP@ss123',
          minLength: 8,
          description: 'Must contain at least 8 characters including uppercase, lowercase, number, and special character'
        }
      }
    }
  })
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
                email: { type: 'string', example: 'user@email.com' },
                username: { type: 'string', example: 'johndoe123' },
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
            message: { type: 'string', example: 'Email and password are required' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Email or username already exists.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Conflict' },
            message: { type: 'string', example: 'Email or username already exists' },
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
  async register(@Body() body: import('./dto/register.dto').RegisterDto) {
    // Validate required fields
    if (!body?.email || !body?.password) {
      throw new BadRequestException('Email and password are required');
    }

    // Check if email already exists and is verified in user table
    const existingUser = await this.userService.findByEmail(body.email);
    if (existingUser && existingUser.isVerified) {
      throw new ConflictException('Email already exists and verified');
    }
    
    // If email exists but not verified in user table, delete the unverified user
    if (existingUser && !existingUser.isVerified) {
      await this.userService.deleteUser(existingUser.id);
    }

    // Check if email already exists in pending_user table
    const existingPendingUser = await this.userService.findPendingUser(body.email);
    if (existingPendingUser) {
      // Delete existing pending user to allow new registration
      await this.userService.deletePendingUser(body.email);
    }

    try {
      // Store pending registration
      const hashedPassword = await bcrypt.hash(body.password, 10);
      await this.userService.createPendingUser(body.email, body.username, hashedPassword);

      try {
        // Send verification OTP
        await this.authService.sendVerificationOTP(body.email);

        return {
          message: 'Verification OTP sent to your email',
          email: body.email
        };
      } catch (emailErr) {
        // If email sending fails, clean up the pending user
        try {
          const user = await this.userService.findByEmail(body.email);
          if (user) {
            await this.userService.deleteUser(user.id);
          }
        } catch (cleanupErr) {
          console.error('Failed to cleanup pending user:', cleanupErr);
        }

        console.error('Email sending error details:', emailErr);
        throw new InternalServerErrorException({
          message: 'Failed to send verification email',
          details: emailErr.message || 'Unknown error',
          error: 'Internal Server Error'
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof InternalServerErrorException) {
        throw err;
      }
      throw new InternalServerErrorException({
        message: 'Registration failed',
        details: err.message || 'Unknown error',
        error: 'Internal Server Error'
      });
    }
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify email using OTP code' })
  @ApiResponse({
    status: 201,
    description: 'Email verified successfully and user registered'
  })
  async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      // Verify OTP
      const isValid = await this.authService.verifyOTP(
        verifyOtpDto.email,
        verifyOtpDto.otp
      );

      if (!isValid) {
        throw new BadRequestException('Invalid OTP');
      }

      // Create user after verification
      const pendingUser = await this.userService.findPendingUser(verifyOtpDto.email);
      if (!pendingUser) {
        throw new BadRequestException('No pending registration found');
      }

      // Create the verified user
      const user = await this.userService.create(pendingUser.email, pendingUser.username, pendingUser.password);

      try {
        // Delete the pending user after successful creation
        await this.userService.deletePendingUser(verifyOtpDto.email);
      } catch (err) {
        console.error('Error cleaning up pending user:', err);
        // Don't throw error here as the user is already created
      }

      return {
        message: 'Email verified and user registered successfully',
        user: {
          id: user.id,
          email: user.email,
          username: user.username // Include username in response
        }
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to verify email');
    }
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP code to email' })
  @ApiResponse({
    status: 200,
    description: 'OTP resent successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - email not found or already verified'
  })
  async resendOTP(@Body() body: ResendOtpDto) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }

    // Check if there's a pending user
    const pendingUser = await this.userService.findPendingUser(body.email);
    if (!pendingUser) {
      throw new BadRequestException('No pending registration found for this email');
    }

    // Send new OTP
    await this.authService.sendVerificationOTP(body.email);

    return {
      message: 'Verification OTP sent to your email',
      email: body.email
    };
  }



  @Post('login')
  @ApiBody({ schema: { properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } } } })
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
                email: { type: 'string', example: 'user@email.com' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Invalid credentials' },
            error: { type: 'string', example: 'Unauthorized' },
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
  async login(@Body() body: import('./dto/login.dto').LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generate refresh token dengan expired berbeda (30 hari)
    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email, username: user.username },
      { secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: '30d' }
    );
    await this.userService.setRefreshToken(user.id, refreshToken);
    const loginResult = await this.authService.login(user);
    return {
      ...loginResult,
      refresh_token: refreshToken,
      refresh_token_expires_in: 30 * 24 * 60 * 60, // 30 hari dalam detik
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Get new access token using refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Token refreshed successfully.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'new.access.token' },
            refresh_token: { type: 'string', example: 'new.refresh.token' },
            expires_in: { type: 'number', example: 900 },
            token_type: { type: 'string', example: 'Bearer' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token'
  })
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refresh_token);
  }


  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user (invalidate refresh token)' })
  @ApiResponse({
    status: 200,
    description: 'Logout success',
    type: LogoutSuccessDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid JWT payload or user already logged out.',
    type: LogoutErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User not found.',
    type: LogoutErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during logout.',
    type: LogoutErrorDto,
  })
  async logout(@Request() req) {
    try {
      const email = req.user?.email;
      if (!email) {
        throw new BadRequestException({
          message: 'Logout failed',
          error: 'Invalid JWT payload: email not found'
        });
      }

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException({
          message: 'Logout failed',
          error: 'User not found'
        });
      }

      // Check if user is already logged out
      const isAlreadyLoggedOut = await this.userService.isUserLoggedOut(user.id);
      if (isAlreadyLoggedOut) {
        throw new BadRequestException({
          message: 'Logout failed',
          error: 'User is already logged out'
        });
      }

      const accessToken = req.headers.authorization?.split(' ')[1];
      const refreshToken = user.refreshToken;
      
      if (!accessToken) {
        throw new BadRequestException('Access token not found');
      }

      // Call auth service logout with both tokens
      return this.authService.logout(
        user.id,
        accessToken,
        refreshToken || '' // Handle case where refresh token might be null
      );
    } catch (error) {
      // If it's already a known exception, re-throw it
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      
      // For any other errors, throw internal server error
      throw new InternalServerErrorException({
        message: 'Logout failed',
        error: 'Internal server error during logout'
      });
    }
  }

  @Get('check-username')
  @ApiOperation({ summary: 'Check if username is available' })
  @ApiQuery({ name: 'username', type: String, description: 'Username to check' })
  @ApiResponse({
    status: 200,
    description: 'Username availability checked',
    schema: {
      type: 'object',
      properties: {
        available: { type: 'boolean' }
      }
    }
  })
  async checkUsername(@Query('username') username: string) {
    if (!username || username.length < 3) {
      throw new BadRequestException('Username must be at least 3 characters');
    }
    const available = await this.authService.checkUsernameAvailability(username);
    return { available };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', format: 'email' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'If email exists, reset link will be sent'
  })
  async forgotPassword(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    await this.authService.sendPasswordResetEmail(body.email);
    return {
      message: 'If the email exists, a password reset link has been sent'
    };
  }

  @Post('validate-reset-token')
  @ApiOperation({ summary: 'Validate password reset token' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['token'],
      properties: {
        token: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Token validation result',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean' }
      }
    }
  })
  async validateResetToken(@Body() body: { token: string }) {
    if (!body.token) {
      throw new BadRequestException('Token is required');
    }
    const valid = await this.authService.validateResetToken(body.token);
    return { valid };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['token', 'newPassword'],
      properties: {
        token: { type: 'string' },
        newPassword: { type: 'string', minLength: 8 }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token'
  })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    if (!body.token || !body.newPassword) {
      throw new BadRequestException('Token and new password are required');
    }
    if (body.newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    await this.authService.resetPassword(body.token, body.newPassword);
    return {
      message: 'Password reset successful'
    };
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    const user = await this.authService.validateOAuthUser(req.user);
    const loginResult = await this.authService.login(user);
    
    // Redirect to frontend with tokens
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/callback?access_token=${loginResult.access_token}&refresh_token=${loginResult.refresh_token}`;
    res.redirect(redirectUrl);
  }

}
