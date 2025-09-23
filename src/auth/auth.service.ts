import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { EmailService } from './email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpVerification } from './entities/otp-verification.entity';
import { InvalidatedToken } from './entities/invalidated-token.entity';
import * as bcrypt from 'bcryptjs';

interface JwtPayload {
  email: string;
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(OtpVerification)
    private otpRepository: Repository<OtpVerification>,
    @InjectRepository(InvalidatedToken)
    private invalidatedTokenRepository: Repository<InvalidatedToken>
  ) {}

  private generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async sendVerificationOTP(email: string): Promise<void> {
    try {
      // Check if there's a recent OTP that hasn't expired
      const recentOtp = await this.otpRepository.findOne({
        where: { email },
        order: { createdAt: 'DESC' }
      });

      if (recentOtp) {
        const now = new Date();
        const timeDiff = (now.getTime() - recentOtp.createdAt.getTime()) / 1000 / 60; // time difference in minutes
        
        if (timeDiff < 5) {
          throw new Error(`Please wait ${Math.ceil(5 - timeDiff)} minutes before requesting a new OTP`);
        }
      }

      // Generate OTP
      const otp = this.generateOTP();
      // Save OTP to database with 5 minutes expiry
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      
      await this.otpRepository.save({
        email,
        otp,
        expiresAt,
        isVerified: false
      });
      try {
        const emailSent = await this.emailService.sendVerificationEmail(email, otp);
        if (!emailSent) {
          throw new Error('Email service returned false');
        }
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        throw new Error(`Failed to send verification email: ${emailError.message}`);
      }
    } catch (error) {
      console.error('Error in sendVerificationOTP:', error);
      throw new Error(`Verification process failed: ${error.message}`);
    }
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const verification = await this.otpRepository.findOne({
      where: { email, otp, isVerified: false },
      order: { createdAt: 'DESC' }
    });

    if (!verification) {
      throw new BadRequestException('Invalid OTP');
    }

    const now = new Date();
    if (now > verification.expiresAt) {
      const timeSinceExpiry = (now.getTime() - verification.expiresAt.getTime()) / 1000 / 60;
      throw new BadRequestException(`OTP has expired. Please request a new OTP. Time since expiry: ${Math.floor(timeSinceExpiry)} minutes`);
    }

    // Mark OTP as verified
    verification.isVerified = true;
    await this.otpRepository.save(verification);

    // Update user verification status
    const user = await this.userService.findByEmail(email);
    if (user) {
      user.isVerified = true;
      await this.userService.updateVerificationStatus(user.id, true);
    }

    return true;
  }


  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Email belum diverifikasi. Silakan cek email Anda untuk verifikasi.');
    }

    if (await bcrypt.compare(password, user.password)) {
      const { password: hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async validateToken(token: string): Promise<any> {
    try {
      // Check if token is blacklisted
      const invalidated = await this.invalidatedTokenRepository.findOne({
        where: { token }
      });

      if (invalidated) {
        throw new UnauthorizedException('Token has been invalidated');
      }

      // Verify the token's signature and expiration
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check if user is logged out
      const isLoggedOut = await this.userService.isUserLoggedOut(user.id);
      if (isLoggedOut) {
        // If logged out, automatically invalidate the token
        await this.invalidateToken(token, user.id);
        throw new UnauthorizedException('User is logged out');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async invalidateToken(token: string, userId: number) {
    try {
      const decoded = this.jwtService.decode(token) as JwtPayload & { exp: number };
      if (decoded && decoded.exp) {
        await this.invalidatedTokenRepository.save({
          token,
          userId,
          expiresAt: new Date(decoded.exp * 1000)
        });
      }
    } catch (error) {
      // If token is invalid, we can ignore the error as it's already unusable
      console.error('Error invalidating token:', error);
    }
  }

  async logout(userId: number, accessToken: string, refreshToken: string) {
    // Invalidate both access and refresh tokens
    await Promise.all([
      this.invalidateToken(accessToken, userId),
      this.invalidateToken(refreshToken, userId)
    ]);

    // Clear refresh token from user record
    await this.userService.updateLogoutStatus(userId);
    
    return { message: 'Logout successful' };
  }

  async login(user: any) {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    
    // Update last login time
    await this.userService.updateLoginStatus(user.id);

    // Generate access token (expires in 15 minutes)
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    
    // Generate refresh token (expires in 7 days)
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.userService.setRefreshToken(user.id, refresh_token);
    await this.userService.updateRefreshTokenRequest(user.id);

    return {
      message: 'Login success',
      access_token,
      refresh_token,
      refresh_token_expires_in: 7 * 24 * 60 * 60, // 7 days in seconds
      expires_in: 15 * 60, // 15 minutes in seconds
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);
      
      // Get user and check if refresh token is valid
      const user = await this.userService.findByRefreshToken(refreshToken);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const newPayload: JwtPayload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(newPayload, { expiresIn: '15m' });
      const new_refresh_token = this.jwtService.sign(newPayload, { expiresIn: '7d' });

      // Update refresh token in database
      await this.userService.setRefreshToken(user.id, new_refresh_token);

      return {
        message: 'Token refreshed successfully',
        access_token,
        refresh_token: new_refresh_token,
        expires_in: 15 * 60,
        token_type: 'Bearer',
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
