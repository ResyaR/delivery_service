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
exports.ShippingManagerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shipping_manager_entity_1 = require("./shipping-manager.entity");
const user_service_1 = require("../users/user.service");
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
let ShippingManagerService = class ShippingManagerService {
    constructor(shippingManagerRepository, userService) {
        this.shippingManagerRepository = shippingManagerRepository;
        this.userService = userService;
    }
    generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    async create(createDto) {
        const existingEmail = await this.shippingManagerRepository.findOne({
            where: { email: createDto.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already exists');
        }
        let token;
        if (createDto.token && createDto.token.trim()) {
            const existingToken = await this.shippingManagerRepository.findOne({
                where: { token: createDto.token.trim() },
            });
            if (existingToken) {
                throw new common_1.ConflictException('Token already exists. Please use a different token.');
            }
            token = createDto.token.trim();
        }
        else {
            token = this.generateToken();
            let existingToken = await this.shippingManagerRepository.findOne({
                where: { token },
            });
            while (existingToken) {
                token = this.generateToken();
                existingToken = await this.shippingManagerRepository.findOne({
                    where: { token },
                });
            }
        }
        const shippingManager = this.shippingManagerRepository.create({
            name: createDto.name,
            email: createDto.email,
            phone: createDto.phone,
            zone: createDto.zone,
            token,
        });
        return await this.shippingManagerRepository.save(shippingManager);
    }
    async createWithUser(createDto) {
        const existingEmail = await this.shippingManagerRepository.findOne({
            where: { email: createDto.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already exists in shipping managers');
        }
        const hashedPassword = await bcrypt.hash(createDto.password, 10);
        try {
            await this.userService.create(createDto.email, createDto.email, hashedPassword);
        }
        catch (error) {
            throw new common_1.ConflictException('Email already exists in users');
        }
        let token = this.generateToken();
        let existingToken = await this.shippingManagerRepository.findOne({
            where: { token },
        });
        while (existingToken) {
            token = this.generateToken();
            existingToken = await this.shippingManagerRepository.findOne({
                where: { token },
            });
        }
        const shippingManager = this.shippingManagerRepository.create({
            name: createDto.name,
            email: createDto.email,
            phone: createDto.phone,
            zone: createDto.zone,
            token,
        });
        return await this.shippingManagerRepository.save(shippingManager);
    }
    async findAll() {
        return await this.shippingManagerRepository.find({
            order: { zone: 'ASC', name: 'ASC' },
        });
    }
    async findByZone(zone) {
        return await this.shippingManagerRepository.find({
            where: { zone, isActive: true },
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const shippingManager = await this.shippingManagerRepository.findOne({
            where: { id },
        });
        if (!shippingManager) {
            throw new common_1.NotFoundException(`Shipping manager with ID ${id} not found`);
        }
        return shippingManager;
    }
    async findByToken(token) {
        const shippingManager = await this.shippingManagerRepository.findOne({
            where: { token, isActive: true },
        });
        if (!shippingManager) {
            throw new common_1.NotFoundException('Invalid token');
        }
        return shippingManager;
    }
    async update(id, updateDto) {
        const shippingManager = await this.findOne(id);
        if (updateDto.email && updateDto.email !== shippingManager.email) {
            const existingEmail = await this.shippingManagerRepository.findOne({
                where: { email: updateDto.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (updateDto.token && updateDto.token.trim() && updateDto.token.trim() !== shippingManager.token) {
            const existingToken = await this.shippingManagerRepository.findOne({
                where: { token: updateDto.token.trim() },
            });
            if (existingToken) {
                throw new common_1.ConflictException('Token already exists. Please use a different token.');
            }
            shippingManager.token = updateDto.token.trim();
        }
        if (updateDto.name !== undefined)
            shippingManager.name = updateDto.name;
        if (updateDto.email !== undefined)
            shippingManager.email = updateDto.email;
        if (updateDto.phone !== undefined)
            shippingManager.phone = updateDto.phone;
        if (updateDto.zone !== undefined)
            shippingManager.zone = updateDto.zone;
        if (updateDto.isActive !== undefined)
            shippingManager.isActive = updateDto.isActive;
        return await this.shippingManagerRepository.save(shippingManager);
    }
    async regenerateToken(id) {
        const shippingManager = await this.findOne(id);
        let token = this.generateToken();
        let existingToken = await this.shippingManagerRepository.findOne({
            where: { token },
        });
        while (existingToken) {
            token = this.generateToken();
            existingToken = await this.shippingManagerRepository.findOne({
                where: { token },
            });
        }
        shippingManager.token = token;
        return await this.shippingManagerRepository.save(shippingManager);
    }
    async remove(id) {
        const shippingManager = await this.findOne(id);
        await this.shippingManagerRepository.softDelete(id);
        await this.shippingManagerRepository.update(id, { isActive: false });
    }
};
exports.ShippingManagerService = ShippingManagerService;
exports.ShippingManagerService = ShippingManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shipping_manager_entity_1.ShippingManager)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], ShippingManagerService);
//# sourceMappingURL=shipping-manager.service.js.map