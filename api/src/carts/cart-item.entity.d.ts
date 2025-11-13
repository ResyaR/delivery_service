import { Cart } from './cart.entity';
import { Menu } from '../menus/menu.entity';
export declare class CartItem {
    id: number;
    cartId: number;
    cart: Cart;
    menuId: number;
    menu: Menu;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}
