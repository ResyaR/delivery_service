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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const swagger_1 = require("@nestjs/swagger");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const resend_otp_dto_1 = require("./dto/resend-otp.dto");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../users/user.service");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const logout_dto_1 = require("./dto/logout.dto");
const passport_1 = require("@nestjs/passport");
let AuthController = class AuthController {
    async loginWithToken(req) {
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
    async getProfile(req) {
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
    constructor(authService, userService, jwtService, configService) {
        this.authService = authService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(body) {
        if (!body?.email || !body?.password) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        const existingUser = await this.userService.findByEmail(body.email);
        if (existingUser && existingUser.isVerified) {
            throw new common_1.ConflictException('Email already exists and verified');
        }
        if (existingUser && !existingUser.isVerified) {
            await this.userService.deleteUser(existingUser.id);
        }
        const existingPendingUser = await this.userService.findPendingUser(body.email);
        if (existingPendingUser) {
            await this.userService.deletePendingUser(body.email);
        }
        try {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            await this.userService.createPendingUser(body.email, body.username, hashedPassword);
            try {
                await this.authService.sendVerificationOTP(body.email);
                return {
                    message: 'Verification OTP sent to your email',
                    email: body.email
                };
            }
            catch (emailErr) {
                try {
                    const user = await this.userService.findByEmail(body.email);
                    if (user) {
                        await this.userService.deleteUser(user.id);
                    }
                }
                catch (cleanupErr) {
                    console.error('Failed to cleanup pending user:', cleanupErr);
                }
                console.error('Email sending error details:', emailErr);
                throw new common_1.InternalServerErrorException({
                    message: 'Failed to send verification email',
                    details: emailErr.message || 'Unknown error',
                    error: 'Internal Server Error'
                });
            }
        }
        catch (err) {
            console.error('Registration error:', err);
            if (err instanceof common_1.InternalServerErrorException) {
                throw err;
            }
            throw new common_1.InternalServerErrorException({
                message: 'Registration failed',
                details: err.message || 'Unknown error',
                error: 'Internal Server Error'
            });
        }
    }
    async verifyOTP(verifyOtpDto) {
        try {
            const isValid = await this.authService.verifyOTP(verifyOtpDto.email, verifyOtpDto.otp);
            if (!isValid) {
                throw new common_1.BadRequestException('Invalid OTP');
            }
            const pendingUser = await this.userService.findPendingUser(verifyOtpDto.email);
            if (!pendingUser) {
                throw new common_1.BadRequestException('No pending registration found');
            }
            const user = await this.userService.create(pendingUser.email, pendingUser.username, pendingUser.password);
            try {
                await this.userService.deletePendingUser(verifyOtpDto.email);
            }
            catch (err) {
                console.error('Error cleaning up pending user:', err);
            }
            return {
                message: 'Email verified and user registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
            };
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException) {
                throw err;
            }
            throw new common_1.InternalServerErrorException('Failed to verify email');
        }
    }
    async resendOTP(body) {
        if (!body.email) {
            throw new common_1.BadRequestException('Email is required');
        }
        const pendingUser = await this.userService.findPendingUser(body.email);
        if (!pendingUser) {
            throw new common_1.BadRequestException('No pending registration found for this email');
        }
        await this.authService.sendVerificationOTP(body.email);
        return {
            message: 'Verification OTP sent to your email',
            email: body.email
        };
    }
    async login(body) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const refreshToken = this.jwtService.sign({ sub: user.id, email: user.email, username: user.username }, { secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: '30d' });
        await this.userService.setRefreshToken(user.id, refreshToken);
        const loginResult = await this.authService.login(user);
        return {
            ...loginResult,
            refresh_token: refreshToken,
            refresh_token_expires_in: 30 * 24 * 60 * 60,
        };
    }
    async refresh(body) {
        return this.authService.refreshToken(body.refresh_token);
    }
    async logout(req) {
        try {
            const email = req.user?.email;
            if (!email) {
                throw new common_1.BadRequestException({
                    message: 'Logout failed',
                    error: 'Invalid JWT payload: email not found'
                });
            }
            const user = await this.userService.findByEmail(email);
            if (!user) {
                throw new common_1.UnauthorizedException({
                    message: 'Logout failed',
                    error: 'User not found'
                });
            }
            const isAlreadyLoggedOut = await this.userService.isUserLoggedOut(user.id);
            if (isAlreadyLoggedOut) {
                throw new common_1.BadRequestException({
                    message: 'Logout failed',
                    error: 'User is already logged out'
                });
            }
            const accessToken = req.headers.authorization?.split(' ')[1];
            const refreshToken = user.refreshToken;
            if (!accessToken) {
                throw new common_1.BadRequestException('Access token not found');
            }
            return this.authService.logout(user.id, accessToken, refreshToken || '');
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException({
                message: 'Logout failed',
                error: 'Internal server error during logout'
            });
        }
    }
    async checkUsername(username) {
        if (!username || username.length < 3) {
            throw new common_1.BadRequestException('Username must be at least 3 characters');
        }
        const available = await this.authService.checkUsernameAvailability(username);
        return { available };
    }
    async forgotPassword(body) {
        if (!body.email) {
            throw new common_1.BadRequestException('Email is required');
        }
        await this.authService.sendPasswordResetEmail(body.email);
        return {
            message: 'If the email exists, a password reset link has been sent'
        };
    }
    async validateResetToken(body) {
        if (!body.token) {
            throw new common_1.BadRequestException('Token is required');
        }
        const valid = await this.authService.validateResetToken(body.token);
        return { valid };
    }
    async resetPassword(body) {
        if (!body.token || !body.newPassword) {
            throw new common_1.BadRequestException('Token and new password are required');
        }
        if (body.newPassword.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters');
        }
        await this.authService.resetPassword(body.token, body.newPassword);
        return {
            message: 'Password reset successful'
        };
    }
    async googleAuth() {
    }
    async googleAuthCallback(req, res) {
        const user = await this.authService.validateOAuthUser(req.user);
        const loginResult = await this.authService.login(user);
        let frontendUrl = this.configService.get('FRONTEND_URL');
        if (!frontendUrl) {
            console.warn('⚠️ FRONTEND_URL environment variable is not set! Using default localhost. Please set FRONTEND_URL in Vercel environment variables.');
            frontendUrl = 'http://localhost:3000';
        }
        const redirectUrl = `${frontendUrl}/auth/callback?access_token=${loginResult.access_token}&refresh_token=${loginResult.refresh_token}`;
        res.redirect(redirectUrl);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('token'),
    (0, swagger_1.ApiOperation)({ summary: 'Login using access token' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or expired token'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify email using OTP code' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Email verified successfully and user registered'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOTP", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Resend OTP code to email' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP resent successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - email not found or already verified'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_otp_dto_1.ResendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOTP", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiBody)({ schema: { properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } } } }),
    (0, swagger_1.ApiResponse)({
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
                        expires_in: { type: 'number', example: 86400 },
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Get new access token using refresh token' }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Token refreshed successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        access_token: { type: 'string', example: 'new.access.token' },
                        refresh_token: { type: 'string', example: 'new.refresh.token' },
                        expires_in: { type: 'number', example: 86400 },
                        token_type: { type: 'string', example: 'Bearer' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid refresh token'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user (invalidate refresh token)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logout success',
        type: logout_dto_1.LogoutSuccessDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request. Invalid JWT payload or user already logged out.',
        type: logout_dto_1.LogoutErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'User not found.',
        type: logout_dto_1.LogoutErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error during logout.',
        type: logout_dto_1.LogoutErrorDto,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('check-username'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if username is available' }),
    (0, swagger_1.ApiQuery)({ name: 'username', type: String, description: 'Username to check' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Username availability checked',
        schema: {
            type: 'object',
            properties: {
                available: { type: 'boolean' }
            }
        }
    }),
    __param(0, (0, common_1.Query)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkUsername", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset email' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['email'],
            properties: {
                email: { type: 'string', format: 'email' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'If email exists, reset link will be sent'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('validate-reset-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate password reset token' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['token'],
            properties: {
                token: { type: 'string' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token validation result',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean' }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateResetToken", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using token' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['token', 'newPassword'],
            properties: {
                token: { type: 'string' },
                newPassword: { type: 'string', minLength: 8 }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset successful'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid or expired token'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Google OAuth login' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth callback' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map