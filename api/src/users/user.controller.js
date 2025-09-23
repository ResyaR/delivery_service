"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_service_1 = require("./user.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const delete_user_dto_1 = require("./dto/delete-user.dto");
const platform_express_1 = require("@nestjs/platform-express");
const admin_token_dto_1 = require("../common/dto/admin-token.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUsers(adminTokenDto) {
        const users = await this.userService.findAll();
        return users.map(user => ({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            avatar: user.avatar,
            lastLogin: user.lastLogin,
            lastLogout: user.lastLogout,
            lastRequestRefreshToken: user.lastRequestRefreshToken
        }));
    }
    async deleteUser(req, deleteUserDto) {
        try {
            await this.userService.deleteUser(req.user.id);
            return {
                message: 'User berhasil dihapus'
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Gagal menghapus user');
        }
    }
    async updateProfile(req, dto) {
        const userId = req.user.id;
        const updated = await this.userService.updateProfile(userId, dto);
        return {
            message: 'Profile updated successfully',
            data: updated,
        };
    }
    async updateAvatar(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('File tidak ditemukan');
        }
        try {
            const fileName = `avatar-${req.user.id}-${Date.now()}.${file.originalname.split('.').pop()}`;
            const filePath = `/uploads/avatars/${fileName}`;
            await this.saveFile(file.buffer, filePath);
            const updated = await this.userService.updateProfile(req.user.id, {
                avatar: `${process.env.APP_URL}${filePath}`
            });
            if (!updated) {
                throw new common_1.InternalServerErrorException('Gagal menyimpan avatar');
            }
            return {
                message: 'Avatar updated successfully',
                data: {
                    id: updated.id,
                    email: updated.email,
                    avatarUrl: updated.avatar
                }
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Gagal menyimpan avatar');
        }
    }
    async saveFile(buffer, filePath) {
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join(process.cwd(), 'public', filePath);
        const directory = path.dirname(fullPath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        await fs.promises.writeFile(fullPath, buffer);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('admin/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users with their activity information (Requires admin token)' }),
    (0, swagger_1.ApiBody)({ type: admin_token_dto_1.AdminTokenDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all users with their activity information',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    email: { type: 'string' },
                    fullName: { type: 'string' },
                    phone: { type: 'string' },
                    avatar: { type: 'string' },
                    lastLogin: { type: 'string', format: 'date-time' },
                    lastLogout: { type: 'string', format: 'date-time' },
                    lastRequestRefreshToken: { type: 'string', format: 'date-time' }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid admin token' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid token format' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_token_dto_1.AdminTokenDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Delete)('delete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user account' }),
    (0, swagger_1.ApiBody)({ type: () => delete_user_dto_1.DeleteUserDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User berhasil dihapus.',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'User berhasil dihapus'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Kata kunci konfirmasi tidak valid.',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Kata kunci tidak valid. Kata kunci yang benar adalah: "resya 123"'
                },
                error: {
                    type: 'string',
                    example: 'Bad Request'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User tidak ditemukan.',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'User tidak ditemukan'
                },
                error: {
                    type: 'string',
                    example: 'Not Found'
                }
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_user_dto_1.DeleteUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile (nama, phone)' }),
    (0, swagger_1.ApiBody)({ type: update_profile_dto_1.UpdateProfileDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully.' }),
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
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('profile/avatar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user avatar' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                avatar: { type: 'string', format: 'binary' }
            },
            required: ['avatar']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Avatar updated successfully.' }),
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
        status: 400,
        description: 'Bad request. File terlalu besar atau format tidak valid.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'number', example: 400 },
                        message: { type: 'string', example: 'File terlalu besar atau format tidak valid' },
                        error: { type: 'string', example: 'Bad Request' },
                    },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
                cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateAvatar", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map