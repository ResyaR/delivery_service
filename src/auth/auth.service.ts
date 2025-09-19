import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
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
  ) {}


  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async logout(userId: number) {
    await this.userService.updateLogoutStatus(userId);
    return { message: 'Logout successful' };
  }

  async login(user: any) {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    
    // Update last login time
    await this.userService.updateLoginStatus(user.id);

    const access_token = this.jwtService.sign(payload);
    
    // Set refresh token
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.userService.setRefreshToken(user.id, refresh_token);
    await this.userService.updateRefreshTokenRequest(user.id);

    return {
      access_token,
      refresh_token
    };
  }
}
