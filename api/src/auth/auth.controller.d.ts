import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly jwtService;
    private readonly configService;
    loginWithToken(req: any): Promise<{
        message: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            phone: any;
        };
    }>;
    getProfile(req: any): Promise<{
        message: string;
        email: null;
        fullName?: undefined;
        phone?: undefined;
        avatar?: undefined;
    } | {
        message: string;
        email: any;
        fullName: any;
        phone: any;
        avatar: any;
    }>;
    constructor(authService: AuthService, userService: UserService, jwtService: JwtService, configService: ConfigService);
    register(body: import('./dto/register.dto').RegisterDto): Promise<{
        message: string;
        email: string;
    }>;
    verifyOTP(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            username: string;
        };
    }>;
    login(body: import('./dto/login.dto').LoginDto): Promise<{
        refresh_token: string;
        refresh_token_expires_in: number;
        access_token: string;
        expires_in: number;
        token_type: string;
        message: string;
    }>;
    refresh(body: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
