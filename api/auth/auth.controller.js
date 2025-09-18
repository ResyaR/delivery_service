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
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../users/user.service");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const logout_dto_1 = require("./dto/logout.dto");
let AuthController = class AuthController {
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
        const existing = await this.userService.findByEmail(body.email);
        if (existing) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        try {
            const user = await this.userService.create(body.email, hashedPassword);
            return {
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                },
            };
        }
        catch (err) {
            if (err && (err.code === '23505' || err?.detail?.includes('already exists'))) {
                throw new common_1.ConflictException('Email already exists');
            }
            throw err;
        }
    }
    async login(body) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const refreshToken = this.jwtService.sign({ sub: user.id, email: user.email }, { secret: this.configService.get('REFRESH_SECRET'), expiresIn: '30d' });
        await this.userService.setRefreshToken(user.id, refreshToken);
        const loginResult = await this.authService.login(user);
        return {
            message: 'Login success',
            ...loginResult,
            refresh_token: refreshToken,
            refresh_token_expires_in: 30 * 24 * 60 * 60,
        };
    }
    async refresh(req) {
        try {
            const authHeader = req.headers['authorization'] || req.headers['Authorization'];
            if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
                throw new common_1.UnauthorizedException('Missing or invalid Authorization header');
            }
            const token = authHeader.substring(7).trim();
            const payload = this.jwtService.verify(token, { secret: this.configService.get('REFRESH_SECRET') });
            const user = await this.userService.findByRefreshToken(token);
            if (!user || !user.refreshToken || user.refreshToken !== token) {
                throw new common_1.UnauthorizedException('Refresh token invalid or already logged out');
            }
            const loginResult = await this.authService.login(user);
            return {
                message: 'Token refreshed successfully',
                ...loginResult,
            };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
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
            await this.userService.setRefreshToken(user.id, '');
            return { message: 'Logout success' };
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
};
exports.AuthController = AuthController;
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
    (0, swagger_1.ApiBody)({ schema: { properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } } } }),
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
        description: 'Conflict. Email already exists.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Conflict' },
                        message: { type: 'string', example: 'Email already exists' },
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
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Returns new access token using refresh token (Bearer)' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map