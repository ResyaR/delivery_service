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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../users/user.service");
let AdminController = class AdminController {
    constructor(userService) {
        this.userService = userService;
    }
    async deleteAllUsers(adminKey) {
        if (adminKey !== 'resya123@') {
            throw new common_1.UnauthorizedException('Invalid admin key');
        }
        try {
            await this.userService.deleteAllUsers();
            return { message: 'All users deleted successfully' };
        }
        catch (error) {
            console.error('Error deleting users:', error);
            throw new common_1.InternalServerErrorException('Failed to delete users: ' + error.message);
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Delete)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete all users (Admin only)' }),
    (0, swagger_1.ApiHeader)({
        name: 'admin-key',
        description: 'Admin key for authentication',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All users deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid admin key',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAllUsers", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map