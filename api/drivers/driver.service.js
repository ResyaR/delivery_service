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
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const driver_entity_1 = require("./driver.entity");
let DriverService = class DriverService {
    constructor(driverRepository) {
        this.driverRepository = driverRepository;
    }
    async create(createDriverDto) {
        const existingDriver = await this.driverRepository.findOne({
            where: { email: createDriverDto.email }
        });
        if (existingDriver) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(createDriverDto.password, 10);
        const driver = this.driverRepository.create({
            ...createDriverDto,
            password: hashedPassword,
        });
        return await this.driverRepository.save(driver);
    }
    async findAll() {
        return await this.driverRepository.find({
            select: ['id', 'fullName', 'email', 'phone', 'status', 'currentLatitude', 'currentLongitude', 'rating', 'totalDeliveries']
        });
    }
    async findAvailableDrivers() {
        return await this.driverRepository.find({
            where: { status: driver_entity_1.DriverStatus.AVAILABLE },
            select: ['id', 'fullName', 'phone', 'currentLatitude', 'currentLongitude', 'rating', 'vehicleType']
        });
    }
    async findOne(id) {
        const driver = await this.driverRepository.findOne({
            where: { id },
            select: ['id', 'fullName', 'email', 'phone', 'status', 'currentLatitude', 'currentLongitude', 'rating', 'totalDeliveries', 'vehicleNumber', 'vehicleType']
        });
        if (!driver) {
            throw new common_1.NotFoundException(`Driver with ID ${id} not found`);
        }
        return driver;
    }
    async updateLocation(id, updateLocationDto) {
        const driver = await this.findOne(id);
        driver.currentLatitude = updateLocationDto.latitude;
        driver.currentLongitude = updateLocationDto.longitude;
        return await this.driverRepository.save(driver);
    }
    async updateStatus(id, status) {
        const driver = await this.findOne(id);
        driver.status = status;
        return await this.driverRepository.save(driver);
    }
    async incrementDeliveries(id) {
        await this.driverRepository.increment({ id }, 'totalDeliveries', 1);
    }
    async updateRating(id, rating) {
        const driver = await this.findOne(id);
        driver.rating = rating;
        return await this.driverRepository.save(driver);
    }
    async findByEmail(email) {
        return await this.driverRepository.findOne({
            where: { email }
        });
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DriverService);
//# sourceMappingURL=driver.service.js.map