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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_entity_1 = require("./menu.entity");
let MenuService = class MenuService {
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }
    async create(createMenuDto) {
        const menu = this.menuRepository.create(createMenuDto);
        return await this.menuRepository.save(menu);
    }
    async findAll(restaurantId) {
        const query = this.menuRepository.createQueryBuilder('menu');
        if (restaurantId) {
            query.where('menu.restaurantId = :restaurantId', { restaurantId });
        }
        query.orderBy('menu.category', 'ASC').addOrderBy('menu.name', 'ASC');
        return await query.getMany();
    }
    async findByRestaurant(restaurantId) {
        return await this.menuRepository.find({
            where: { restaurantId },
            order: { category: 'ASC', name: 'ASC' },
        });
    }
    async findOne(id) {
        const menu = await this.menuRepository.findOne({
            where: { id },
            relations: ['restaurant'],
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu with ID ${id} not found`);
        }
        return menu;
    }
    async update(id, updateMenuDto) {
        const menu = await this.findOne(id);
        Object.assign(menu, updateMenuDto);
        return await this.menuRepository.save(menu);
    }
    async remove(id) {
        const menu = await this.findOne(id);
        await this.menuRepository.remove(menu);
    }
    async updateAvailability(id, availability) {
        const menu = await this.findOne(id);
        menu.availability = availability;
        return await this.menuRepository.save(menu);
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MenuService);
//# sourceMappingURL=menu.service.js.map