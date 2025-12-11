import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create(createMenuDto);
    return await this.menuRepository.save(menu);
  }

  async findAll(restaurantId?: number): Promise<Menu[]> {
    const query = this.menuRepository.createQueryBuilder('menu');
    
    if (restaurantId) {
      query.where('menu.restaurantId = :restaurantId', { restaurantId });
    }
    
    query.orderBy('menu.category', 'ASC').addOrderBy('menu.name', 'ASC');
    return await query.getMany();
  }

  async findByRestaurant(restaurantId: number): Promise<Menu[]> {
    return await this.menuRepository.find({
      where: { restaurantId },
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ 
      where: { id },
      relations: ['restaurant'],
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);
    Object.assign(menu, updateMenuDto);
    return await this.menuRepository.save(menu);
  }

  async remove(id: number): Promise<void> {
    const menu = await this.findOne(id);
    // Use soft delete instead of hard delete
    // Also set availability to false when soft deleting
    await this.menuRepository.softDelete(id);
    // Update availability to false as well
    await this.menuRepository.update(id, { availability: false });
  }

  async updateAvailability(id: number, availability: boolean): Promise<Menu> {
    const menu = await this.findOne(id);
    menu.availability = availability;
    return await this.menuRepository.save(menu);
  }
}

