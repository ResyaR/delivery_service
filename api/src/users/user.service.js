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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const pending_user_entity_1 = require("./entities/pending-user.entity");
let UserService = class UserService {
    constructor(userRepository, pendingUserRepository) {
        this.userRepository = userRepository;
        this.pendingUserRepository = pendingUserRepository;
    }
    async create(email, username, password) {
        const user = this.userRepository.create({
            email,
            username,
            password,
            isVerified: true
        });
        return this.userRepository.save(user);
    }
    async findById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async findAll() {
        return this.userRepository.find();
    }
    getWIBDate() {
        const date = new Date();
        return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    }
    async updateLoginStatus(userId) {
        await this.userRepository.update(userId, {
            lastLogin: this.getWIBDate()
        });
    }
    async updateLogoutStatus(userId) {
        await this.userRepository.update(userId, {
            lastLogout: this.getWIBDate(),
            refreshToken: undefined
        });
    }
    async updateRefreshTokenRequest(userId) {
        await this.userRepository.update(userId, {
            lastRequestRefreshToken: new Date()
        });
    }
    async updateProfile(id, dto) {
        await this.userRepository.update(id, dto);
        return this.findById(id);
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'username', 'isAdmin', 'isVerified', 'fullName', 'phone', 'avatar', 'refreshToken']
        });
    }
    async setRefreshToken(userId, refreshToken) {
        await this.userRepository.update(userId, { refreshToken });
    }
    async findByRefreshToken(refreshToken) {
        return this.userRepository.findOne({ where: { refreshToken } });
    }
    async isUserLoggedOut(userId) {
        const user = await this.findById(userId);
        return !user || !user.refreshToken || user.refreshToken === '';
    }
    async deleteUser(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        await this.userRepository.softDelete(userId);
    }
    async updateVerificationStatus(userId, isVerified) {
        await this.userRepository.update(userId, { isVerified });
    }
    async deleteAllUsers() {
        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`
        DELETE FROM "delivery"
        WHERE "userId" IN (
          SELECT id FROM "user"
          WHERE "isAdmin" = false
        )
      `);
            await queryRunner.query(`
        DELETE FROM "user"
        WHERE "isAdmin" = false
      `);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createPendingUser(email, username, password) {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        const pendingUser = this.pendingUserRepository.create({
            email,
            username,
            password,
            expiresAt
        });
        return this.pendingUserRepository.save(pendingUser);
    }
    async findPendingUser(email) {
        return this.pendingUserRepository.findOne({
            where: { email },
            order: { createdAt: 'DESC' }
        });
    }
    async deletePendingUser(email) {
        await this.pendingUserRepository.delete({ email });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(pending_user_entity_1.PendingUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map