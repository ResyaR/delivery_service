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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./cart.entity");
const cart_item_entity_1 = require("./cart-item.entity");
const menu_entity_1 = require("../menus/menu.entity");
let CartService = class CartService {
    constructor(cartRepository, cartItemRepository, menuRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.menuRepository = menuRepository;
    }
    async getCart(userId) {
        let cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.menu', 'items.menu.restaurant'],
        });
        if (!cart) {
            cart = this.cartRepository.create({ userId });
            cart = await this.cartRepository.save(cart);
        }
        if (cart.items && cart.items.length > 0 && cart.items[0].menu?.restaurant) {
            cart.restaurantId = cart.items[0].menu.restaurant.id;
            await this.cartRepository.save(cart);
        }
        return this.mapToResponseDto(cart);
    }
    async addItemToCart(userId, addItemDto) {
        let cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.menu', 'items.menu.restaurant'],
        });
        if (!cart) {
            cart = this.cartRepository.create({ userId });
            cart = await this.cartRepository.save(cart);
            cart = await this.cartRepository.findOne({
                where: { userId },
                relations: ['items', 'items.menu', 'items.menu.restaurant'],
            });
            if (!cart || !cart.id) {
                throw new Error('Failed to create cart with valid ID');
            }
        }
        if (!cart.id) {
            cart = await this.cartRepository.findOne({
                where: { userId },
                relations: ['items', 'items.menu', 'items.menu.restaurant'],
            });
            if (!cart || !cart.id) {
                throw new Error('Failed to load or create cart with valid ID');
            }
        }
        const menu = await this.menuRepository.findOne({
            where: { id: addItemDto.menuId },
            relations: ['restaurant'],
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu with ID ${addItemDto.menuId} not found`);
        }
        if (!menu.availability) {
            throw new common_1.BadRequestException(`Menu ${menu.name} is not available`);
        }
        const existingItem = cart.items?.find(item => item.menuId === addItemDto.menuId);
        if (existingItem) {
            const existingItemId = existingItem.id;
            if (!existingItemId) {
                throw new Error('Existing cart item has no ID');
            }
            const currentItem = await this.cartItemRepository.findOne({
                where: { id: existingItemId },
                select: ['id', 'quantity'],
            });
            if (!currentItem) {
                throw new common_1.NotFoundException(`Cart item with ID ${existingItemId} not found`);
            }
            await this.cartItemRepository
                .createQueryBuilder()
                .update(cart_item_entity_1.CartItem)
                .set({
                quantity: currentItem.quantity + addItemDto.quantity,
                price: menu.price,
            })
                .where('id = :id', { id: existingItemId })
                .execute();
        }
        else {
            if (!cart.id) {
                cart = await this.cartRepository.findOne({
                    where: { userId },
                    select: ['id'],
                });
                if (!cart || !cart.id) {
                    throw new Error(`Cart ID is undefined when creating new cart item. User ID: ${userId}`);
                }
            }
            await this.cartItemRepository
                .createQueryBuilder()
                .insert()
                .into(cart_item_entity_1.CartItem)
                .values({
                cartId: cart.id,
                menuId: addItemDto.menuId,
                quantity: addItemDto.quantity,
                price: menu.price,
            })
                .execute();
        }
        cart.restaurantId = menu.restaurant.id;
        await this.cartRepository.save(cart);
        const reloadedCart = await this.cartRepository.findOne({
            where: { id: cart.id },
            relations: ['items', 'items.menu', 'items.menu.restaurant'],
        });
        if (!reloadedCart) {
            throw new common_1.NotFoundException('Cart not found after adding item');
        }
        return this.mapToResponseDto(reloadedCart);
    }
    async updateCartItem(userId, itemId, updateDto) {
        const cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.menu'],
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const cartItem = cart.items.find(item => item.id === itemId);
        if (!cartItem) {
            throw new common_1.NotFoundException(`Cart item with ID ${itemId} not found`);
        }
        cartItem.cartId = cart.id;
        const menu = await this.menuRepository.findOne({
            where: { id: cartItem.menuId },
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu with ID ${cartItem.menuId} not found`);
        }
        if (!menu.availability) {
            throw new common_1.BadRequestException(`Menu ${menu.name} is not available`);
        }
        cartItem.quantity = updateDto.quantity;
        cartItem.price = menu.price;
        await this.cartItemRepository.save(cartItem);
        const updatedCart = await this.cartRepository.findOne({
            where: { id: cart.id },
            relations: ['items', 'items.menu', 'items.menu.restaurant'],
        });
        if (!updatedCart) {
            throw new common_1.NotFoundException('Cart not found after updating item');
        }
        return this.mapToResponseDto(updatedCart);
    }
    async removeItemFromCart(userId, itemId) {
        const cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items'],
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const cartItem = cart.items.find(item => item.id === itemId);
        if (!cartItem) {
            throw new common_1.NotFoundException(`Cart item with ID ${itemId} not found`);
        }
        if (cartItem.cartId !== cart.id) {
            throw new common_1.NotFoundException('Cart item does not belong to this cart');
        }
        await this.cartItemRepository.remove(cartItem);
        const updatedCart = await this.cartRepository.findOne({
            where: { id: cart.id },
            relations: ['items', 'items.menu', 'items.menu.restaurant'],
        });
        if (!updatedCart) {
            throw new common_1.NotFoundException('Cart not found after removing item');
        }
        if (updatedCart.items.length === 0) {
            updatedCart.restaurantId = null;
            await this.cartRepository.save(updatedCart);
        }
        return this.mapToResponseDto(updatedCart);
    }
    async clearCart(userId) {
        const cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items'],
        });
        if (!cart) {
            return;
        }
        if (cart.items && cart.items.length > 0) {
            await this.cartItemRepository.remove(cart.items);
        }
        cart.restaurantId = null;
        await this.cartRepository.save(cart);
    }
    mapToResponseDto(cart) {
        const items = (cart.items || []).map(item => ({
            id: item.id,
            menuId: item.menuId,
            menuName: item.menu?.name || 'Unknown Menu',
            menuImage: item.menu?.image || null,
            price: Number(item.price),
            quantity: item.quantity,
            subtotal: Number(item.price) * item.quantity,
        }));
        const total = items.reduce((sum, item) => sum + item.subtotal, 0);
        const restaurantName = cart.items && cart.items.length > 0 && cart.items[0].menu?.restaurant
            ? cart.items[0].menu.restaurant.name
            : null;
        return {
            id: cart.id,
            userId: cart.userId,
            restaurantId: cart.restaurantId,
            restaurantName,
            items,
            total,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map