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
exports.AddressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const address_entity_1 = require("./address.entity");
let AddressService = class AddressService {
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
    }
    async create(userId, createAddressDto) {
        if (createAddressDto.isDefault) {
            await this.addressRepository.update({ userId }, { isDefault: false });
        }
        const address = this.addressRepository.create({
            ...createAddressDto,
            userId,
        });
        return await this.addressRepository.save(address);
    }
    async findAll(userId) {
        return await this.addressRepository.find({
            where: { userId },
            order: { isDefault: 'DESC', createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const address = await this.addressRepository.findOne({
            where: { id, userId },
        });
        if (!address) {
            throw new common_1.NotFoundException(`Address with ID ${id} not found`);
        }
        return address;
    }
    async update(id, userId, updateAddressDto) {
        const address = await this.findOne(id, userId);
        if (updateAddressDto.isDefault) {
            await this.addressRepository
                .createQueryBuilder()
                .update(address_entity_1.Address)
                .set({ isDefault: false })
                .where('userId = :userId AND id != :id', { userId, id })
                .execute();
        }
        Object.assign(address, updateAddressDto);
        return await this.addressRepository.save(address);
    }
    async remove(id, userId) {
        const address = await this.findOne(id, userId);
        await this.addressRepository.remove(address);
    }
    async setDefault(id, userId) {
        await this.addressRepository.update({ userId }, { isDefault: false });
        const address = await this.findOne(id, userId);
        address.isDefault = true;
        return await this.addressRepository.save(address);
    }
};
exports.AddressService = AddressService;
exports.AddressService = AddressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddressService);
//# sourceMappingURL=address.service.js.map