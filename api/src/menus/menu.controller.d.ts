import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenuController {
    private readonly menuService;
    private readonly ADMIN_KEY;
    constructor(menuService: MenuService);
    private validateAdminKey;
    create(adminKey: string, createMenuDto: CreateMenuDto): Promise<{
        message: string;
        data: import("./menu.entity").Menu;
    }>;
    findAll(restaurantId?: string): Promise<{
        message: string;
        data: import("./menu.entity").Menu[];
    }>;
    findByRestaurant(restaurantId: string): Promise<{
        message: string;
        data: import("./menu.entity").Menu[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: import("./menu.entity").Menu;
    }>;
    update(adminKey: string, id: string, updateMenuDto: UpdateMenuDto): Promise<{
        message: string;
        data: import("./menu.entity").Menu;
    }>;
    updateAvailability(adminKey: string, id: string, availability: boolean): Promise<{
        message: string;
        data: import("./menu.entity").Menu;
    }>;
    remove(adminKey: string, id: string): Promise<{
        message: string;
    }>;
}
