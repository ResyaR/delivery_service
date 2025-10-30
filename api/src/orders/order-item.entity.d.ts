import { Order } from './order.entity';
import { Menu } from '../menus/menu.entity';
export declare class OrderItem {
    id: number;
    orderId: number;
    order: Order;
    menuId: number;
    menu: Menu;
    menuName: string;
    price: number;
    quantity: number;
    subtotal: number;
}
