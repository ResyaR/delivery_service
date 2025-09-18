import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly jwtService;
    private readonly configService;
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
        user: {
            id: number;
            email: string;
        };
    }>;
    login(body: import('./dto/login.dto').LoginDto): Promise<{
        refresh_token: string;
        refresh_token_expires_in: number;
        access_token: string;
        message: string;
    }>;
    refresh(req: any): Promise<{
        access_token: string;
        message: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
