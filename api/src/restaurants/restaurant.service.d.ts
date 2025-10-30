import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
export declare class RestaurantService {
    private restaurantRepository;
    constructor(restaurantRepository: Repository<Restaurant>);
    create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant>;
    findAll(status?: string): Promise<Restaurant[]>;
    findOne(id: number): Promise<Restaurant>;
    update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant>;
    remove(id: number): Promise<void>;
    incrementOrderCount(id: number): Promise<void>;
    updateRating(id: number, newRating: number): Promise<void>;
}
