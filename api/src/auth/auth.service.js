"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../users/user.service");
const email_service_1 = require("./email.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const otp_verification_entity_1 = require("./entities/otp-verification.entity");
const invalidated_token_entity_1 = require("./entities/invalidated-token.entity");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    constructor(userService, jwtService, emailService, otpRepository, invalidatedTokenRepository) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.otpRepository = otpRepository;
        this.invalidatedTokenRepository = invalidatedTokenRepository;
    }
    generateOTP() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
    async sendVerificationOTP(email) {
        try {
            const recentOtp = await this.otpRepository.findOne({
                where: { email },
                order: { createdAt: 'DESC' }
            });
            if (recentOtp) {
                const now = new Date();
                const timeDiff = (now.getTime() - recentOtp.createdAt.getTime()) / 1000 / 60;
                if (timeDiff < 5) {
                    throw new Error(`Please wait ${Math.ceil(5 - timeDiff)} minutes before requesting a new OTP`);
                }
            }
            const otp = this.generateOTP();
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
            }
            catch (emailError) {
                console.error('Email sending failed:', emailError);
                throw new Error(`Failed to send verification email: ${emailError.message}`);
            }
        }
        catch (error) {
            console.error('Error in sendVerificationOTP:', error);
            throw new Error(`Verification process failed: ${error.message}`);
        }
    }
    async verifyOTP(email, otp) {
        const verification = await this.otpRepository.findOne({
            where: { email, otp, isVerified: false },
            order: { createdAt: 'DESC' }
        });
        if (!verification) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        const now = new Date();
        if (now > verification.expiresAt) {
            const timeSinceExpiry = (now.getTime() - verification.expiresAt.getTime()) / 1000 / 60;
            throw new common_1.BadRequestException(`OTP has expired. Please request a new OTP. Time since expiry: ${Math.floor(timeSinceExpiry)} minutes`);
        }
        verification.isVerified = true;
        await this.otpRepository.save(verification);
        const user = await this.userService.findByEmail(email);
        if (user) {
            user.isVerified = true;
            await this.userService.updateVerificationStatus(user.id, true);
        }
        return true;
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return null;
        }
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException('Email belum diverifikasi. Silakan cek email Anda untuk verifikasi.');
        }
        if (await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async validateToken(token) {
        try {
            const invalidated = await this.invalidatedTokenRepository.findOne({
                where: { token }
            });
            if (invalidated) {
                throw new common_1.UnauthorizedException('Token has been invalidated');
            }
            const payload = this.jwtService.verify(token);
            const user = await this.userService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const isLoggedOut = await this.userService.isUserLoggedOut(user.id);
            if (isLoggedOut) {
                await this.invalidateToken(token, user.id);
                throw new common_1.UnauthorizedException('User is logged out');
            }
            return user;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async invalidateToken(token, userId) {
        try {
            const decoded = this.jwtService.decode(token);
            if (decoded && decoded.exp) {
                await this.invalidatedTokenRepository.save({
                    token,
                    userId,
                    expiresAt: new Date(decoded.exp * 1000)
                });
            }
        }
        catch (error) {
            console.error('Error invalidating token:', error);
        }
    }
    async logout(userId, accessToken, refreshToken) {
        await Promise.all([
            this.invalidateToken(accessToken, userId),
            this.invalidateToken(refreshToken, userId)
        ]);
        await this.userService.updateLogoutStatus(userId);
        return { message: 'Logout successful' };
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        await this.userService.updateLoginStatus(user.id);
        const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.userService.setRefreshToken(user.id, refresh_token);
        await this.userService.updateRefreshTokenRequest(user.id);
        return {
            access_token,
            refresh_token,
            expires_in: 15 * 60,
            token_type: 'Bearer'
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userService.findByRefreshToken(refreshToken);
            if (!user || user.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const newPayload = { email: user.email, sub: user.id };
            const access_token = this.jwtService.sign(newPayload, { expiresIn: '15m' });
            const new_refresh_token = this.jwtService.sign(newPayload, { expiresIn: '7d' });
            await this.userService.setRefreshToken(user.id, new_refresh_token);
            return {
                access_token,
                refresh_token: new_refresh_token,
                expires_in: 15 * 60,
                token_type: 'Bearer'
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(otp_verification_entity_1.OtpVerification)),
    __param(4, (0, typeorm_1.InjectRepository)(invalidated_token_entity_1.InvalidatedToken)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map