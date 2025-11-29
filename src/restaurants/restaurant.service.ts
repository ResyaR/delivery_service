import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create(createRestaurantDto);
    return await this.restaurantRepository.save(restaurant);
  }

  async findAll(status?: string, city?: string): Promise<Restaurant[]> {
    const query = this.restaurantRepository.createQueryBuilder('restaurant');
    
    if (status) {
      query.where('restaurant.status = :status', { status });
    }
    
    // Filter by city if provided (search in address field)
    if (city) {
      if (status) {
        query.andWhere('LOWER(restaurant.address) LIKE LOWER(:city)', { city: `%${city}%` });
      } else {
        query.where('LOWER(restaurant.address) LIKE LOWER(:city)', { city: `%${city}%` });
      }
    }
    
    query.orderBy('restaurant.rating', 'DESC');
    return await query.getMany();
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    Object.assign(restaurant, updateRestaurantDto);
    return await this.restaurantRepository.save(restaurant);
  }

  async remove(id: number): Promise<void> {
    const restaurant = await this.findOne(id);
    await this.restaurantRepository.remove(restaurant);
  }

  async incrementOrderCount(id: number): Promise<void> {
    await this.restaurantRepository.increment({ id }, 'totalOrders', 1);
  }

  async updateRating(id: number, newRating: number): Promise<void> {
    await this.restaurantRepository.update(id, { rating: newRating });
  }
}

