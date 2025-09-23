import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { EmailService } from './email.service';
import { Repository } from 'typeorm';
import { OtpVerification } from './entities/otp-verification.entity';
import { InvalidatedToken } from './entities/invalidated-token.entity';
export declare class AuthService {
    private userService;
    private jwtService;
    private emailService;
    private otpRepository;
    private invalidatedTokenRepository;
    constructor(userService: UserService, jwtService: JwtService, emailService: EmailService, otpRepository: Repository<OtpVerification>, invalidatedTokenRepository: Repository<InvalidatedToken>);
    private generateOTP;
    sendVerificationOTP(email: string): Promise<void>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
    validateUser(email: string, password: string): Promise<any>;
    validateToken(token: string): Promise<any>;
    private invalidateToken;
    logout(userId: number, accessToken: string, refreshToken: string): Promise<{
        message: string;
    }>;
    login(user: any): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
        refresh_token_expires_in: number;
        expires_in: number;
        token_type: string;
        user: {
            id: any;
            email: any;
            username: any;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
        user: {
            id: number;
            email: string;
            username: string;
        };
    }>;
}
