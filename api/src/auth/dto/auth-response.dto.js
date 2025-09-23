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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutResponseDto = exports.ProfileResponseDto = exports.RefreshResponseDto = exports.RegisterResponseDto = exports.LoginResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class LoginResponseDto {
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Login success' }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2592000 }),
    __metadata("design:type", Number)
], LoginResponseDto.prototype, "refresh_token_expires_in", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1200 }),
    __metadata("design:type", Number)
], LoginResponseDto.prototype, "expires_in", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bearer' }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "token_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 1,
            email: 'user@email.com'
        }
    }),
    __metadata("design:type", Object)
], LoginResponseDto.prototype, "user", void 0);
class RegisterResponseDto {
}
exports.RegisterResponseDto = RegisterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'User registered successfully' }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 1,
            email: 'user@email.com'
        }
    }),
    __metadata("design:type", Object)
], RegisterResponseDto.prototype, "user", void 0);
class RefreshResponseDto {
}
exports.RefreshResponseDto = RefreshResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Token refreshed successfully' }),
    __metadata("design:type", String)
], RefreshResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    __metadata("design:type", String)
], RefreshResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1200 }),
    __metadata("design:type", Number)
], RefreshResponseDto.prototype, "expires_in", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bearer' }),
    __metadata("design:type", String)
], RefreshResponseDto.prototype, "token_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 1,
            email: 'user@email.com'
        }
    }),
    __metadata("design:type", Object)
], RefreshResponseDto.prototype, "user", void 0);
class ProfileResponseDto {
}
exports.ProfileResponseDto = ProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Profile fetched successfully' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@email.com' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Budi Santoso', required: false }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+628123456789', required: false }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.example.com/avatar.jpg', required: false }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "avatar", void 0);
class LogoutResponseDto {
}
exports.LogoutResponseDto = LogoutResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Logout success' }),
    __metadata("design:type", String)
], LogoutResponseDto.prototype, "message", void 0);
//# sourceMappingURL=auth-response.dto.js.map