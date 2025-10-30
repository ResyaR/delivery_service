import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
export declare class RestaurantController {
    private readonly restaurantService;
    private readonly ADMIN_KEY;
    constructor(restaurantService: RestaurantService);
    private validateAdminKey;
    create(adminKey: string, createRestaurantDto: CreateRestaurantDto): Promise<{
        message: string;
        data: import("./restaurant.entity").Restaurant;
    }>;
    findAll(status?: string): Promise<{
        message: string;
        data: import("./restaurant.entity").Restaurant[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: import("./restaurant.entity").Restaurant;
    }>;
    update(adminKey: string, id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<{
        message: string;
        data: import("./restaurant.entity").Restaurant;
    }>;
    remove(adminKey: string, id: string): Promise<{
        message: string;
    }>;
}
